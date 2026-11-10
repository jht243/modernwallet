"""Release only the terminating native session’s conditional search-job lease."""
import json
import sys
from job_worker import release_at_session_end

if __name__ == '__main__':
    release_at_session_end(json.load(sys.stdin))
