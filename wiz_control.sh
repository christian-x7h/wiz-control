#!/bin/bash

# Functions

get_light_details() {
  echo '{"method":"getPilot","params":{}}' | nc -u -w 1 $1 38899
}

set_light_color() {
  echo "{\"id\":1,\"method\":\"setPilot\",\"params\":{\"r\":$2,\"g\":$3,\"b\":$4,\"dimming\":100}}" | nc -u -w 1 $1 38899
}

toggle_light() {
  echo "{\"id\":1,\"method\":\"setState\",\"params\":{\"state\":$2}}" | nc -u -w 1 $1 38899
}

discover_lights() {
  if ! command -v arp-scan &> /dev/null; then
    echo "arp-scan command not found. Please install arp-scan and try again."
    exit 1
  fi

  arp_scan_results=$(arp-scan --localnet --interface=en0)
  wiz_ips=($(echo "$arp_scan_results" | grep -Eo '([0-9]{1,3}\.){3}[0-9]{1,3}(.*)(WiZ IoT Company Limited|WiZ Connected Lighting Company Limited)' | awk '{ print $1 }'))

  if [ ${#wiz_ips[@]} -eq 0 ]; then
    echo "No WiZ devices found on the network."
    exit 1
  fi

  for ip in "${wiz_ips[@]}"; do
    echo "Found WiZ device at IP: $ip"
  done
}

# Main script

if [[ "$#" -eq 0 ]]; then
  echo "Usage: $0 COMMAND [IP_ADDRESS] [PARAMETERS]"
  echo "Commands:"
  echo "  get_details IP_ADDRESS"
  echo "  set_color IP_ADDRESS RED GREEN BLUE"
  echo "  toggle IP_ADDRESS STATE (true or false)"
  echo "  discover"
  exit 1
fi

COMMAND=$1

case $COMMAND in
  get_details)
    IP_ADDRESS=$2
    get_light_details $IP_ADDRESS
    ;;
  set_color)
    IP_ADDRESS=$2
    RED=$3
    GREEN=$4
    BLUE=$5
    set_light_color $IP_ADDRESS $RED $GREEN $BLUE
    ;;
  toggle)
    IP_ADDRESS=$2
    STATE=$3
    toggle_light $IP_ADDRESS $STATE
    ;;
  discover)
    discover_lights
    ;;
  *)
    echo "Invalid command"
    exit 1
    ;;
esac
