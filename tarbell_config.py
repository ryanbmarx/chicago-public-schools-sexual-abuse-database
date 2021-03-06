# -*- coding: utf-8 -*-

"""
Tarbell project configuration
"""
from flask import Blueprint, g, json
import jinja2 #for context-getting


blueprint = Blueprint('cps-abuse-database', __name__)

@blueprint.app_template_filter('get_max_value')
def get_max_value(data, k):
    """
    Returns the max value from a list of dicts -- k is for key
    """

    seq = [x[k] for x in data]
    return max(seq)


@blueprint.app_template_filter('generate_autocomplete_list')
def generate_autocomplete_list(crimes):
    """
    Takes the list of crimes and creates a list of unique school names
    
    """

    retval = []
    for c in crimes:
        retval.append(c['FINAL_SKL_NAME'].strip());

    retval = list(set(retval))

    return json.dumps(retval)


# Google document key for the stories. If not specified, the Archie stuff is skipped
# DOC_KEY = "None"

# Google spreadsheet key
SPREADSHEET_KEY = "1OuidYb3r9ml5JxDfxCMqHTKG3Pn1g6jjJHVeOeVbzjM"

# Exclude these files from publication
EXCLUDES = [
    '*.md', 
    'requirements.txt', 
    'node_modules', 
    'sass', 
    'js/src', 
    '*.ai', 
    'package.json',
    'package-lock.json', 
    'scripts', 
    'base-sass', 
    'img/svgs', 
    'ai/**/*.html', 
    'tips/**/*.html',
    'Gruntfile.js'
]

# Spreadsheet cache lifetime in seconds. (Default: 4)
# SPREADSHEET_CACHE_TTL = 4

# Create JSON data at ./data.json, disabled by default
# CREATE_JSON = True

# Get context from a local file or URL. This file can be a CSV or Excel
# spreadsheet file. Relative, absolute, and remote (http/https) paths can be 
# used.
# CONTEXT_SOURCE_FILE = ""

# EXPERIMENTAL: Path to a credentials file to authenticate with Google Drive.
# This is useful for for automated deployment. This option may be replaced by
# command line flag or environment variable. Take care not to commit or publish
# your credentials file.
# CREDENTIALS_PATH = ""

# S3 bucket configuration
S3_BUCKETS = {
    # Provide target -> s3 url pairs, such as:
    #     "mytarget": "mys3url.bucket.url/some/path"
    # then use tarbell publish mytarget to publish to it
    
    "production": "graphics.chicagotribune.com/cps-abuse-database",
    "staging": "apps.beta.tribapps.com/cps-abuse-database",
}

# Default template variables
DEFAULT_CONTEXT = {
   'OMNITURE': {   'domain': 'chicagotribune.com',
                    'section': 'news',
                    'sitename': 'Chicago Tribune',
                    'subsection': 'local',
                    'subsubsection': '',
                    'type': 'dataproject'},
    'name': 'cps-abuse-database',
    'title': 'CPS Abuse Database'
}