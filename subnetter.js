'use strict';

(function() {
  var root = this;
  var previousSubnetter = root.Subnetter;

  var Subnetter = {};

  Subnetter.addressToBinary = function(address) {
    var decimalValues = [];
    var convertedAddress = [];

    var splitAddress = address.split('.');
    for(var i = 0; i < splitAddress.length; i++) {
      decimalValues.push(Number(splitAddress[i]));
    }

    for(i = 0; i < decimalValues.length; i++) {
      convertedAddress.push(Subnetter.octetToBinary(decimalValues[i]));
    }

    return convertedAddress;
  };

  addressToDecimal = function(address) {
    var joinedAddress = Subnetter.addressToBinary(address).join('');
    var bitPlaceValues = [2147483648, 1073741824, 536870912, 268435456, 134217728, 67108864, 33554432, 16777216, 8388608, 4194304, 2097152, 1048576, 524288, 262144, 131072, 65536, 32768, 16384, 8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1];
    var bitValue = 0;

    for(var bit = 0; bit < 32; bit++) {
      if(joinedAddress.charAt(bit) === '1') {
        bitValue = bitValue + bitPlaceValues[bit];
      }
    }

    return bitValue;
  };

  andOctets = function(octetOne, octetTwo){
    var convertedOctet = [];

    for(var bit = 0; bit < 8; bit++) {
      if(octetOne.charAt(bit) === '1' && octetTwo.charAt(bit) === '1') {
        convertedOctet.push(1);
      } else { convertedOctet.push(0); }
    }

    return convertedOctet.join('');
  };

  getBroadcast = function(address, netmask) {
    var network = Subnetter.addressToBinary(Subnetter.getNetwork(address, netmask));
    var binaryNetmask = Subnetter.addressToBinary(netmask);
    var broadcast = [];

    for(var octet = 0; octet < 4; octet++) {
      broadcast.push(Subnetter.octetToDecimal(Subnetter.xorOctets(network[octet], Subnetter.invertOctet(binaryNetmask[octet]))));
    }

    return broadcast.join('.');
  };

  getFirstUsable = function(address, netmask) {
    var network = Subnetter.getNetwork(address, netmask).split('.');
    network[3] = Number(network[3] + 1);

    return network.join('.');
  };

  getHost = function(address, netmask) {
    var binaryAddress = Subnetter.addressToBinary(address);
    var binaryNetmask = Subnetter.addressToBinary(netmask);
    var host = [];

    for(var octet = 0; octet < 4; octet++) {
      host.push(Subnetter.octetToDecimal(Subnetter.andOctets(binaryAddress[octet], Subnetter.invertOctet(binaryNetmask[octet]))));
    }

    return host.join('.');
  };

  getLastUsable = function(address, netmask) {
    var broadcast = Subnetter.getBroadcast(address, netmask).split('.');
    broadcast[3] = Number(broadcast[3] - 1);

    return broadcast.join('.');
  };

  Subnetter.getNetwork = function(address, netmask) {
    var binaryAddress = Subnetter.addressToBinary(address);
    var binaryNetmask = Subnetter.addressToBinary(netmask);
    var network = [];

    for(var octet = 0; octet < 4; octet++) {
      network.push(Subnetter.octetToDecimal(Subnetter.andOctets(binaryAddress[octet], binaryNetmask[octet])));
    }

    return network.join('.');
  };

  Subnetter.invertOctet = function(octet) {
    var invertedOctet = [];

    for(var bit = 0; bit < 8; bit++) {
      if(octet.charAt(bit) === '1') {
        invertedOctet.push(0);
      } else { invertedOctet.push(1); }
    }

    return invertedOctet.join('');
  };

  Subnetter.octetToBinary = function(octet){
    var bitPlaceValues = [128, 64, 32, 16, 8, 4, 2, 1];
    var bitValues = [];

    for(var i = 0; i < bitPlaceValues.length; i++) {
      if(octet % bitPlaceValues[i] !== octet) {
        octet = octet - bitPlaceValues[i];
        bitValues.push(1);
      } else { bitValues.push(0); }
    }

    return bitValues.join('');
  };

  Subnetter.octetToDecimal = function(octet) {
    var bitPlaceValues = [128, 64, 32, 16, 8, 4, 2, 1];
    var bitValue = 0;

    for(var bit = 0; bit < 8; bit++) {
      if(octet.charAt(bit) === '1') {
        bitValue = bitValue + bitPlaceValues[bit];
      }
    }

    return bitValue;
  };

  Subnetter.xorOctets = function(octetOne, octetTwo) {
    var convertedOctet = [];

    for(var bit = 0; bit < 8; bit++) {
      if(octetOne.charAt(bit) ^ octetTwo.charAt(bit)) {
        convertedOctet.push(1);
      } else { convertedOctet.push(0); }
    }

    return convertedOctet.join('');
  };

  Subnetter.checkIPInSubnet = function(address, subnet_id, netmask){
    var addr = Subnetter.addressToDecimal(address);
    var sub  = Subnetter.addressToDecimal(subnet_id);
    var mask = Subnetter.addressToDecimal(netmask);

    if ((addr & mask) === sub){
      return 1;
    }
    else{
      return 0;
    }
  };

  Subnetter.noConflict = function() {
    root.Subnetter = previousSubnetter;
    return Subnetter;
  };

  if(typeof exports !== 'undefined') {
    if(typeof module !== 'undefined' && module.exports) {
      exports = module.exports = Subnetter
    }
    exports.Subnetter = Subnetter
  }
  else {
    root.Subnetter = Subnetter
  }

}).call(this);
