#!c:\users\jacob\desktop\coding\algoplatform1\algoplatformenv\scripts\python.exe
# EASY-INSTALL-ENTRY-SCRIPT: 'git-remote-codecommit==1.15.1','console_scripts','git-remote-codecommit'
__requires__ = 'git-remote-codecommit==1.15.1'
import re
import sys
from pkg_resources import load_entry_point

if __name__ == '__main__':
    sys.argv[0] = re.sub(r'(-script\.pyw?|\.exe)?$', '', sys.argv[0])
    sys.exit(
        load_entry_point('git-remote-codecommit==1.15.1', 'console_scripts', 'git-remote-codecommit')()
    )
