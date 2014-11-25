'use strict';

function addressToBinary(address) {
  var address = address.split('.');
  var decimalValues = [];
  var convertedAddress = [];

  for(var octet of address) {
    decimalValues.push(Number(octet));
  }

  for(var octet of decimalValues) {
    convertedAddress.push(octetToBinary(octet));
  }

  return convertedAddress;
}

function andOctets(octetOne, octetTwo){
  var convertedOctet = [];

  for(var bit = 0; bit < 8; bit++) {
    if(octetOne.charAt(bit) === '1' && octetTwo.charAt(bit) === '1') {
      convertedOctet.push(1);
    } else { convertedOctet.push(0); }
  }

  return convertedOctet.join('');
}

function getBroadcast(address, netmask) {
  var network = addressToBinary(getNetwork(address, netmask));
  var netmask = addressToBinary(netmask);
  var broadcast = [];

  for(var octet = 0; octet < 4; octet++) {
    broadcast.push(octetToDecimal(xorOctets(network[octet], invertOctet(netmask[octet]))));
  }

  return broadcast.join('.');
}

function getFirstUsable(address, netmask) {
  var network = getNetwork(address, netmask).split('.');
  network[3] = Number(network[3] + 1);

  return network.join('.');
}

function getHost(address, netmask) {
  var address = addressToBinary(address);
  var netmask = addressToBinary(netmask);
  var host = [];

  for(var octet = 0; octet < 4; octet++) {
    host.push(octetToDecimal(andOctets(address[octet], invertOctet(netmask[octet]))));
  }

  return host.join('.');
}

function getLastUsable(address, netmask) {
  var broadcast = getBroadcast(address, netmask).split('.');
  broadcast[3] = Number(broadcast[3] - 1);

  return broadcast.join('.');
}

function getNetwork(address, netmask) {
  var address = addressToBinary(address);
  var netmask = addressToBinary(netmask);
  var network = [];

  for(var octet = 0; octet < 4; octet++) {
    network.push(octetToDecimal(andOctets(address[octet], netmask[octet])));
  }

  return network.join('.');
}

function invertOctet(octet) {
  var invertedOctet = [];

  for(var bit = 0; bit < 8; bit++) {
    if(octet.charAt(bit) === '1') {
      invertedOctet.push(0);
    } else { invertedOctet.push(1); }
  }

  return invertedOctet.join('');
}

function octetToBinary(octet){
  var bitPlaceValues = [128, 64, 32, 16, 8, 4, 2, 1];
  var bitValues = [];

  for(var value of bitPlaceValues) {
    if(octet % value !== octet) {
      octet = octet - value;
      bitValues.push(1);
    } else { bitValues.push(0); }
  }

  return bitValues.join('');
}

function octetToDecimal(octet) {
  var bitPlaceValues = [128, 64, 32, 16, 8, 4, 2, 1];
  var bitValue = 0;

  for(var bit = 0; bit < 8; bit++) {
    if(octet.charAt(bit) === '1') {
      bitValue = bitValue + bitPlaceValues[bit];
    }
  }

  return bitValue;
}

function xorOctets(octetOne, octetTwo) {
  var convertedOctet = [];

  for(var bit = 0; bit < 8; bit++) {
    if(octetOne.charAt(bit) ^ octetTwo.charAt(bit)) {
      convertedOctet.push(1);
    } else { convertedOctet.push(0); }
  }

  return convertedOctet.join('');
}
