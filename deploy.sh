#!/bin/bash

SOURCE_BRANCH="main"        
DEPLOY_BRANCH="gh-pages"    
BUILD_COMMAND="npm run build" 

echo "🚀 Starting deployment to $DEPLOY_BRANCH..."

echo "📦 Building project..."
$BUILD_COMMAND

echo "📁 Preparing temporary worktree..."
rm -rf /tmp/project-deploy
git worktree add -B $DEPLOY_BRANCH /tmp/project-deploy
echo "copying files..."
rm -rf /tmp/project-deploy/*
cp -a dist/. /tmp/project-deploy/

cd /tmp/project-deploy
git add -A
git commit -m "Deploy update: $(date)"
git push origin $DEPLOY_BRANCH --force

echo "🧹 Cleaning up..."
cd -
git worktree remove /tmp/project-deploy

echo "✅ Successfully deployed to $DEPLOY_BRANCH!"