describe('Language', function() {
  it('Should load language definition', function() {
    expect(lang).toBeDefined();
  });

  it('Should include multi-language', function() {
    expect(lang['lang']['en']).toBeDefined();
    expect(lang['lang']['es']).toBeDefined();
  });
});