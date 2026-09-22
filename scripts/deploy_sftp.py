"""Stage, verify and switch only wescaleit/; retain the previous release."""
import hashlib
import json
import os
from pathlib import Path
import re
import stat
import tempfile
import paramiko


def exists(sftp, path):
    try:
        return sftp.lstat(path)
    except FileNotFoundError:
        return None


def deploy(sftp, root, run):
    target, stage, backup = 'wescaleit', 'wescaleit-release-' + run, 'wescaleit-backup-' + run
    if exists(sftp, stage) or exists(sftp, backup):
        raise RuntimeError('Release paths already exist; inspect before retrying.')
    old = exists(sftp, target)
    if old:
        if not stat.S_ISDIR(old.st_mode):
            raise RuntimeError('Target must be a real directory.')
        if sftp.listdir(target):
            with sftp.open(target + '/.wescaleit-release.json') as f:
                if json.load(f).get('site') != 'wescaleit.com':
                    raise RuntimeError('Existing directory belongs to a different site.')
    sftp.mkdir(stage)
    dirs = {stage}
    files = sorted(p for p in root.rglob('*') if p.is_file())
    for file in files:
        rel = file.relative_to(root)
        parent = stage
        for part in rel.parts[:-1]:
            parent += '/' + part
            if parent not in dirs:
                sftp.mkdir(parent); dirs.add(parent)
        remote = stage + '/' + rel.as_posix()
        sftp.put(str(file), remote, confirm=True)
        sftp.chmod(remote, 0o644)
        with sftp.open(remote, 'rb') as f:
            if hashlib.sha256(f.read()).digest() != hashlib.sha256(file.read_bytes()).digest():
                raise RuntimeError('Upload checksum mismatch; current website unchanged.')
    with sftp.open(stage + '/.wescaleit-release.json', 'w') as f:
        f.write(json.dumps({'site': 'wescaleit.com', 'commit': os.environ.get('GITHUB_SHA')}))
    if old:
        sftp.rename(target, backup)
    try:
        sftp.rename(stage, target)
    except Exception:
        if old:
            sftp.rename(backup, target)
        raise
    print(f'Verified and deployed {len(files)} files to wescaleit/.')
    if old:
        print(f'Previous version retained in {backup}/.')


def main():
    required = ('UD_SFTP_HOST', 'UD_SFTP_USER', 'UD_SFTP_PASSWORD')
    missing = [key for key in required if not os.environ.get(key)]
    if missing:
        raise SystemExit('Missing repository secrets: ' + ', '.join(missing))
    run = os.environ.get('GITHUB_RUN_ID', '') + '-' + os.environ.get('GITHUB_RUN_ATTEMPT', '')
    if not re.fullmatch(r'\d+-\d+', run):
        raise SystemExit('Run through GitHub Actions.')
    with paramiko.SSHClient() as client:
        client.load_system_host_keys()
        known = os.environ.get('UD_SFTP_KNOWN_HOSTS', '').strip()
        if known:
            with tempfile.NamedTemporaryFile(mode='w') as f:
                f.write(known + '\n'); f.flush(); client.load_host_keys(f.name)
        else:
            # Same first-connection trust convention as the other brand deployments.
            client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        client.connect(os.environ['UD_SFTP_HOST'], port=int(os.environ.get('UD_SFTP_PORT') or 22),
                       username=os.environ['UD_SFTP_USER'], password=os.environ['UD_SFTP_PASSWORD'],
                       look_for_keys=False, allow_agent=False, timeout=30, auth_timeout=30, banner_timeout=30)
        with client.open_sftp() as sftp:
            deploy(sftp, Path('dist/wescaleit'), run)


if __name__ == '__main__':
    main()
