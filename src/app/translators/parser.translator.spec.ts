/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ParserTranslator } from './parser.translator';

describe('Service: Parser', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ParserTranslator]
    });
  });

  it('should ...', inject([ParserTranslator], (service: ParserTranslator) => {
    expect(service).toBeTruthy();
  }));
});
