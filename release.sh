#!/bin/bash

: <<'END_USAGE'
./release.sh patch "fix: fix message here"
./release.sh minor "feat: add new feature"
./release.sh major "breaking: big rewrite"
END_USAGE


# Defaults
version_type="patch"
commit_message=""

# Check arg 1 (version type)
if [[ "$1" == "major" || "$1" == "minor" || "$1" == "patch" ]]; then
  version_type=$1
  shift
fi

# Check arg 2 (commit message)
if [ -z "$1" ]; then
  echo "No commit message supplied. Please enter a commit message:"
  read commit_message
else
  commit_message="$*"
fi

if [ -z "$commit_message" ]; then
  echo "Commit message cannot be empty. Aborting."
  exit 1
fi

echo "Using version bump: $version_type"
echo "Commit message: $commit_message"

# Stage changes
git add .

# Commit
git commit -m "$commit_message"

# Version bump
npm version $version_type

# Push commit + tags
git push origin main --tags

# Publish to npm
npm publish

echo "✅ Published new $version_type version with message: $commit_message"
