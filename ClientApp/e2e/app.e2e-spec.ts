import { AppPage } from './app.po';

describe('signar-web App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Signar BS4 Angular6');
  });
});
