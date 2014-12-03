'use strict';

var Subnetter = (function(obj) {
  obj.addressToBinary = function(address) {
    var address = address.split('.');
    var decimalValues = [];
    var convertedAddress = [];

    for(var octet of address) {
      decimalValues.push(Number(octet));
    }

    for(var octet of decimalValues) {
      convertedAddress.push(obj.octetToBinary(octet));
    }

    return convertedAddress;
  }

  obj.addressToDecimal = function(address) {
    var address = obj.addressToBinary(address).join('');
    var bitPlaceValues = [2147483648, 1073741824, 536870912, 268435456, 134217728, 67108864, 33554432, 16777216, 8388608, 4194304, 2097152, 1048576, 524288, 262144, 131072, 65536, 32768, 16384, 8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1];
    var bitValue = 0;

    for(var bit = 0; bit < 32; bit++) {
      if(address.charAt(bit) === '1') {
        bitValue = bitValue + bitPlaceValues[bit];
      }
    }

    return bitValue;
  }

  obj.andOctets = function(octetOne, octetTwo){
    var convertedOctet = [];

    for(var bit = 0; bit < 8; bit++) {
      if(octetOne.charAt(bit) === '1' && octetTwo.charAt(bit) === '1') {
        convertedOctet.push(1);
      } else { convertedOctet.push(0); }
    }

    return convertedOctet.join('');
  }

  obj.getBroadcast = function(address, netmask) {
    var network = obj.addressToBinary(obj.getNetwork(address, netmask));
    var netmask = obj.addressToBinary(netmask);
    var broadcast = [];

    for(var octet = 0; octet < 4; octet++) {
      broadcast.push(obj.octetToDecimal(obj.xorOctets(network[octet], obj.invertOctet(netmask[octet]))));
    }

    return broadcast.join('.');
  }

  obj.getFirstUsable = function(address, netmask) {
    var network = obj.getNetwork(address, netmask).split('.');
    network[3] = Number(network[3] + 1);

    return network.join('.');
  }

  obj.getHost = function(address, netmask) {
    var address = obj.addressToBinary(address);
    var netmask = obj.addressToBinary(netmask);
    var host = [];

    for(var octet = 0; octet < 4; octet++) {
      host.push(obj.octetToDecimal(obj.andOctets(address[octet], obj.invertOctet(netmask[octet]))));
    }

    return host.join('.');
  }

  obj.getLastUsable = function(address, netmask) {
    var broadcast = obj.getBroadcast(address, netmask).split('.');
    broadcast[3] = Number(broadcast[3] - 1);

    return broadcast.join('.');
  }

  obj.getNetwork = function(address, netmask) {
    var address = obj.addressToBinary(address);
    var netmask = obj.addressToBinary(netmask);
    var network = [];

    for(var octet = 0; octet < 4; octet++) {
      network.push(obj.octetToDecimal(obj.andOctets(address[octet], netmask[octet])));
    }

    return network.join('.');
  }

  obj.invertOctet = function(octet) {
    var invertedOctet = [];

    for(var bit = 0; bit < 8; bit++) {
      if(octet.charAt(bit) === '1') {
        invertedOctet.push(0);
      } else { invertedOctet.push(1); }
    }

    return invertedOctet.join('');
  }

  obj.octetToBinary = function(octet){
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

  obj.octetToDecimal = function(octet) {
    var bitPlaceValues = [128, 64, 32, 16, 8, 4, 2, 1];
    var bitValue = 0;

    for(var bit = 0; bit < 8; bit++) {
      if(octet.charAt(bit) === '1') {
        bitValue = bitValue + bitPlaceValues[bit];
      }
    }

    return bitValue;
  }

  obj.xorOctets = function(octetOne, octetTwo) {
    var convertedOctet = [];

    for(var bit = 0; bit < 8; bit++) {
      if(octetOne.charAt(bit) ^ octetTwo.charAt(bit)) {
        convertedOctet.push(1);
      } else { convertedOctet.push(0); }
    }

    return convertedOctet.join('');
  }

  return obj;

})(Subnetter || {});
