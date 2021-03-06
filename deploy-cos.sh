
#!/usr/bin/env bash
#
# Upload the app to Heroku. Runs the compile script in package.json which
# should compile typescript, pug and sass files then minimize the output. A
# temporary branch is created which contains only the compiled html, css and
# javascript files along with the node server before uploading them to Heroku.
#
# TO-DO:
#
#   - Check to ensure the developer has all of the proper prerequisites for
#     Heroku installed. 
#       * Ruby
#       * SASS
#       * Heroku Toolbelt
#   - Check to ensure user is logged into Heroku and crime-or-sublime app is
#     added.
#   - Find a way to add the date and proper commit message to when committing


###############################################################################
#                               CONSTANTS                                     #
###############################################################################
EXIT_OK=0
ERROR=1

CURRENT_DATE=$(date)

ORIGINAL_BRANCH=$(git rev-parse --abbrev-ref HEAD)
DEPLOY_BRANCH="heroku_deploy"

UNCOMPILED_COS_PATH="./src"
COS_CONFIGURATIONS="./configurations"
COMPILED_COS_FILES="./dist"

# Should remove f later. Could be dangerous...
HEROKU_DEPLOY_COS="git push -f heroku $DEPLOY_BRANCH:master"

GIT_DEPLOY_COMMIT_MESSAGE="'Deployed CoS app created on: $CURRENT_DATE'"
GIT_CHECKOUT_ORIGINAL_BRANCH="git checkout $ORIGINAL_BRANCH"
GIT_CREATE_AND_CHECKOUT_DEPLOY_BRANCH="git checkout -b $DEPLOY_BRANCH"
GIT_DELETE_DEPLOY_BRANCH="git branch -D $DEPLOY_BRANCH"
GIT_ADD_COMPILED_FILES="git add -f $COMPILED_COS_FILES \
$COS_SYSTEMJS_CONFIG $COS_CLIENT_LIBRARIES"
GIT_COMMIT_COMPILED_APP="git commit -m 'deployed'"
GIT_RESTORE_BRANCH_FILES="git checkout ."

COMPILE_COS="npm run build"

###############################################################################
#                                FUNCTIONS                                    #
###############################################################################

run_command ()
{
  if [ -z "$2" ]; then
    printf "\nError: Both a command and error message are required for the\
 run_command function.\n\n"
    exit $ERROR
  fi

  $1

  return_code=$?

  if [ $return_code -ne 0 ]; then
    printf $2
    exit $ERROR
  fi
}


###############################################################################
#                               MAIN SEQUENCE                                 #
###############################################################################

if [ "$ORIGINAL_BRANCH" = "$DEPLOY_BRANCH" ]; then
  printf "\nYou are current on the $DEPLOY_BRANCH which is supposed to be \
temporary.\n\nLeave this branch and delete it.\n\n"
   exit $ERROR
fi

run_command "$COMPILE_COS" "\nCould not compile CoS application.\n\n"

run_command "$GIT_CREATE_AND_CHECKOUT_DEPLOY_BRANCH"  "\nError occured \
creating temporary git branch.\n\n"

run_command "$GIT_ADD_COMPILED_FILES" "\nCould not add compiled app to \
repo.\n\n"

run_command "$GIT_COMMIT_COMPILED_APP" "\nCould not commit compiled app to \
the repo.\n\n"

run_command "$HEROKU_DEPLOY_COS" "\nCould not deploy app to Heroku.\n\n"

run_command "$GIT_CHECKOUT_ORIGINAL_BRANCH" "\nCould not checkout branch \
script was called from.\n\n"

run_command "$GIT_RESTORE_BRANCH_FILES" "\nError restoring original files in \
this branch."

run_command "$GIT_DELETE_DEPLOY_BRANCH" "\nError deleting $DEPLOY_BRANCH \
branch. Be sure to resolve.\n\n"
