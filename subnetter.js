'use strict';

var Subnetter = (function(obj) {

  obj.addressToBinary = function(address) {
    var decimalValues = [];
    var convertedAddress = [];

    var splitAddress = address.split('.');
    for(var i = 0; i < splitAddress.length; i++) {
      decimalValues.push(Number(splitAddress[i]));
    }

    for(i = 0; i < decimalValues.length; i++) {
      convertedAddress.push(obj.octetToBinary(decimalValues[i]));
    }

    return convertedAddress;
  };

  obj.addressToDecimal = function(address) {
    var joinedAddress = obj.addressToBinary(address).join('');
    var bitPlaceValues = [2147483648, 1073741824, 536870912, 268435456, 134217728, 67108864, 33554432, 16777216, 8388608, 4194304, 2097152, 1048576, 524288, 262144, 131072, 65536, 32768, 16384, 8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1];
    var bitValue = 0;

    for(var bit = 0; bit < 32; bit++) {
      if(joinedAddress.charAt(bit) === '1') {
        bitValue = bitValue + bitPlaceValues[bit];
      }
    }

    return bitValue;
  };

  obj.andOctets = function(octetOne, octetTwo){
    var convertedOctet = [];

    for(var bit = 0; bit < 8; bit++) {
      if(octetOne.charAt(bit) === '1' && octetTwo.charAt(bit) === '1') {
        convertedOctet.push(1);
      } else { convertedOctet.push(0); }
    }

    return convertedOctet.join('');
  };

  obj.getBroadcast = function(address, netmask) {
    var network = obj.addressToBinary(obj.getNetwork(address, netmask));
    var binaryNetmask = obj.addressToBinary(netmask);
    var broadcast = [];

    for(var octet = 0; octet < 4; octet++) {
      broadcast.push(obj.octetToDecimal(obj.xorOctets(network[octet], obj.invertOctet(binaryNetmask[octet]))));
    }

    return broadcast.join('.');
  };

  obj.getFirstUsable = function(address, netmask) {
    var network = obj.getNetwork(address, netmask).split('.');
    network[3] = Number(network[3] + 1);

    return network.join('.');
  };

  obj.getHost = function(address, netmask) {
    var binaryAddress = obj.addressToBinary(address);
    var binaryNetmask = obj.addressToBinary(netmask);
    var host = [];

    for(var octet = 0; octet < 4; octet++) {
      host.push(obj.octetToDecimal(obj.andOctets(binaryAddress[octet], obj.invertOctet(binaryNetmask[octet]))));
    }

    return host.join('.');
  };

  obj.getLastUsable = function(address, netmask) {
    var broadcast = obj.getBroadcast(address, netmask).split('.');
    broadcast[3] = Number(broadcast[3] - 1);

    return broadcast.join('.');
  };

  obj.getNetwork = function(address, netmask) {
    var binaryAddress = obj.addressToBinary(address);
    var binaryNetmask = obj.addressToBinary(netmask);
    var network = [];

    for(var octet = 0; octet < 4; octet++) {
      network.push(obj.octetToDecimal(obj.andOctets(binaryAddress[octet], binaryNetmask[octet])));
    }

    return network.join('.');
  };

  obj.invertOctet = function(octet) {
    var invertedOctet = [];

    for(var bit = 0; bit < 8; bit++) {
      if(octet.charAt(bit) === '1') {
        invertedOctet.push(0);
      } else { invertedOctet.push(1); }
    }

    return invertedOctet.join('');
  };

  obj.octetToBinary = function(octet){
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

  obj.octetToDecimal = function(octet) {
    var bitPlaceValues = [128, 64, 32, 16, 8, 4, 2, 1];
    var bitValue = 0;

    for(var bit = 0; bit < 8; bit++) {
      if(octet.charAt(bit) === '1') {
        bitValue = bitValue + bitPlaceValues[bit];
      }
    }

    return bitValue;
  };

  obj.xorOctets = function(octetOne, octetTwo) {
	var convertedOctet = [];

    for(var bit = 0; bit < 8; bit++) {
      if(octetOne.charAt(bit) ^ octetTwo.charAt(bit)) {
        convertedOctet.push(1);
      } else { convertedOctet.push(0); }
    }

    return convertedOctet.join('');
  };

  obj.checkIPInSubnet = function(address, subnet_id, netmask){
  	var addr = obj.addressToDecimal(address);
  	var sub  = obj.addressToDecimal(subnet_id);
  	var mask = obj.addressToDecimal(netmask);

  	if ((addr & mask) === sub){
  		return 1;
  	}
  	else{
  		return 0;
  	}

  };

  return obj;

})(Subnetter || {});
