'use strict';

(function() {
  var root = this;
  var previousSubnetter = root.Subnetter;

  var Subnetter = function() {
    self.addressToBinary = function(address) {
      var decimalValues = [];
      var convertedAddress = [];

      var splitAddress = address.split('.');
      for(var i = 0; i < splitAddress.length; i++) {
        decimalValues.push(Number(splitAddress[i]));
      }

      for(i = 0; i < decimalValues.length; i++) {
        convertedAddress.push(self.octetToBinary(decimalValues[i]));
      }

      return convertedAddress;
    };

    self.addressToDecimal = function(address) {
      var joinedAddress = self.addressToBinary(address).join('');
      var bitPlaceValues = [2147483648, 1073741824, 536870912, 268435456, 134217728, 67108864, 33554432, 16777216, 8388608, 4194304, 2097152, 1048576, 524288, 262144, 131072, 65536, 32768, 16384, 8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1];
      var bitValue = 0;

      for(var bit = 0; bit < 32; bit++) {
        if(joinedAddress.charAt(bit) === '1') {
          bitValue = bitValue + bitPlaceValues[bit];
        }
      }

      return bitValue;
    };

    self.andOctets = function(octetOne, octetTwo){
      var convertedOctet = [];

      for(var bit = 0; bit < 8; bit++) {
        if(octetOne.charAt(bit) === '1' && octetTwo.charAt(bit) === '1') {
          convertedOctet.push(1);
        } else { convertedOctet.push(0); }
      }

      return convertedOctet.join('');
    };

    self.getBroadcast = function(address, netmask) {
      var network = self.addressToBinary(self.getNetwork(address, netmask));
      var binaryNetmask = self.addressToBinary(netmask);
      var broadcast = [];

      for(var octet = 0; octet < 4; octet++) {
        broadcast.push(self.octetToDecimal(self.xorOctets(network[octet], self.invertOctet(binaryNetmask[octet]))));
      }

      return broadcast.join('.');
    };

    self.getFirstUsable = function(address, netmask) {
      var network = self.getNetwork(address, netmask).split('.');
      network[3] = Number(network[3] + 1);

      return network.join('.');
    };

    self.getHost = function(address, netmask) {
      var binaryAddress = self.addressToBinary(address);
      var binaryNetmask = self.addressToBinary(netmask);
      var host = [];

      for(var octet = 0; octet < 4; octet++) {
        host.push(self.octetToDecimal(self.andOctets(binaryAddress[octet], self.invertOctet(binaryNetmask[octet]))));
      }

      return host.join('.');
    };

    self.getLastUsable = function(address, netmask) {
      var broadcast = self.getBroadcast(address, netmask).split('.');
      broadcast[3] = Number(broadcast[3] - 1);

      return broadcast.join('.');
    };

    self.getNetwork = function(address, netmask) {
      var binaryAddress = self.addressToBinary(address);
      var binaryNetmask = self.addressToBinary(netmask);
      var network = [];

      for(var octet = 0; octet < 4; octet++) {
        network.push(self.octetToDecimal(self.andOctets(binaryAddress[octet], binaryNetmask[octet])));
      }

      return network.join('.');
    };

    self.invertOctet = function(octet) {
      var invertedOctet = [];

      for(var bit = 0; bit < 8; bit++) {
        if(octet.charAt(bit) === '1') {
          invertedOctet.push(0);
        } else { invertedOctet.push(1); }
      }

      return invertedOctet.join('');
    };

    self.octetToBinary = function(octet){
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

    self.octetToDecimal = function(octet) {
      var bitPlaceValues = [128, 64, 32, 16, 8, 4, 2, 1];
      var bitValue = 0;

      for(var bit = 0; bit < 8; bit++) {
        if(octet.charAt(bit) === '1') {
          bitValue = bitValue + bitPlaceValues[bit];
        }
      }

      return bitValue;
    };

    self.xorOctets = function(octetOne, octetTwo) {
      var convertedOctet = [];

      for(var bit = 0; bit < 8; bit++) {
        if(octetOne.charAt(bit) ^ octetTwo.charAt(bit)) {
          convertedOctet.push(1);
        } else { convertedOctet.push(0); }
      }

      return convertedOctet.join('');
    };

    self.checkIPInSubnet = function(address, subnet_id, netmask){
      var addr = self.addressToDecimal(address);
      var sub  = self.addressToDecimal(subnet_id);
      var mask = self.addressToDecimal(netmask);

      if ((addr & mask) === sub){
        return 1;
      }
      else{
        return 0;
      }
    };
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
