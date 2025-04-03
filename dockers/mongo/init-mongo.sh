#!/bin/bash
set -e

 mongosh "mongodb://root:pulse2025@localhost:27018/pulse?authSource=admin" <<EOF
use metavest
db.createCollection('defaultCollection')
EOF