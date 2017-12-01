#!/bin/bash
mkdir "../server_data/doc_log"
mkdir "../server_data/doc_log/logs"

chown -R dgame:dgame "../server_data/doc_log"

echo '*/5 * * * * sh /home/dgame/server_data/doc_log/loghandle.sh > /dev/null &' >> /var/spool/cron/dgame