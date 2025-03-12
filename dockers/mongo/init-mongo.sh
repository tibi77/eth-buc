#!/bin/bash
set -e

mongosh -u "root" -p "bootit2025" --authenticationDatabase admin <<EOF
use bookit
db.createCollection('defaultCollection')
EOF