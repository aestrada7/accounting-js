describe('App', function() {
  beforeEach(function() {
    os = {};

    os.platform = function() {
      return 'win32';
    };
  });

  it('Should retrieve the platform', function() {
    expect(os.platform()).toEqual('win32');
  });
});