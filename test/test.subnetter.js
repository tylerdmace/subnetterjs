var expect = chai.expect;

describe('SubnetterJS', function() {

  it('should convert an IP address to binary', function() {
    expect(Subnetter.addressToBinary('192.168.1.1')).to.deep.equal(['11000000', '10101000', '00000001', '00000001']);
  });

  it('should convert an IP address to decimal', function() {
    expect(Subnetter.addressToDecimal('192.168.1.1')).to.equal(3232235777);
  });

  it('should "and" two octets', function() {
    expect(Subnetter.andOctets('10101010', '01010101')).to.equal('00000000');
    expect(Subnetter.andOctets('11111111', '11111111')).to.equal('11111111');
    expect(Subnetter.andOctets('00000000', '00000000')).to.equal('00000000');
  });

  it('should get a broadcast address', function () {
    expect(Subnetter.getBroadcast('192.168.1.1', '255.255.255.0')).to.equal('192.168.1.255');
    expect(Subnetter.getBroadcast('192.168.1.1', '255.255.0.0')).to.equal('192.168.255.255');
  });

  it('should get the first usable address', function () {
    expect(Subnetter.getFirstUsable('192.168.1.0', '255.255.255.0')).to.equal('192.168.1.1');
    expect(Subnetter.getFirstUsable('192.168.1.0', '255.255.0.0')).to.equal('192.168.0.1');
    expect(Subnetter.getFirstUsable('192.168.1.0', '255.0.0.0')).to.equal('192.0.0.1');
  });

  it('should get the last usable address', function () {
    expect(Subnetter.getLastUsable).to.be.a('function');
    expect(Subnetter.getLastUsable('192.168.1.0', '255.255.255.0')).to.equal('192.168.1.254');
  });

  it('should get the host part of an IP address', function () {
    expect(Subnetter.getHost('192.168.1.1', '255.255.255.0')).to.equal('0.0.0.1');
    expect(Subnetter.getHost('192.168.1.1', '255.255.0.0')).to.equal('0.0.1.1');
  });

  it('should get the network part of an IP address', function () {
    expect(Subnetter.getNetwork('192.168.1.0', '255.255.255.0')).to.equal('192.168.1.0');
  });

  it('can check if an IP is part of a subnet', function() {
    expect(Subnetter.checkIPInSubnet('192.168.1.1', '192.168.1.0', '255.255.255.0'), 1);
    expect(Subnetter.checkIPInSubnet('192.168.204.201', '192.168.204.0', '255.255.255.0'), 1);
    expect(Subnetter.checkIPInSubnet('192.168.203.100', '192.168.204.0', '255.255.255.0') ,0);
  })

});
