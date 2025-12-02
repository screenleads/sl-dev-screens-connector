import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
/*
import { AdvicesService } from './advices.service';

describe('AdvicesService', () => {
  let service: AdvicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdvicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /*
  it('should get advices', (done) => {
    // const http = TestBed.inject(HttpClient);
    const adviceMock = { id: 1, description: 'desc', customInterval: false, interval: 10, media: undefined, promotion: null, visibilityRules: [] };
    const http = TestBed.inject(HttpClient);
    spyOn(http, 'get').and.returnValue(of([adviceMock]));
    service.getAdvices().subscribe((res) => {
      expect(res).toEqual([adviceMock]);
      done();
    });
  });

  it('should get advices visibles', (done) => {
    // const http = TestBed.inject<any>(require('@angular/common/http').HttpClient);
    const adviceMock = { id: 2, description: 'visible', customInterval: true, interval: 20, media: undefined, promotion: null, visibilityRules: [] };
    spyOn(http, 'get').and.returnValue({ subscribe: ({ next }: any) => next([adviceMock]) });
    service.getAdvicesVisibles().subscribe((res) => {
      expect(res).toEqual([adviceMock]);
      done();
    });
  });

  it('should get advices visibles by device', (done) => {
    const http = TestBed.inject<any>(require('@angular/common/http').HttpClient);
    const adviceMock = { id: 3, description: 'byDevice', customInterval: false, interval: 30, media: undefined, promotion: null, visibilityRules: [] };
    spyOn(http, 'get').and.returnValue({ subscribe: ({ next }: any) => next([adviceMock]) });
    service.getAdvicesVisiblesByDevice(5).subscribe((res) => {
      expect(res).toEqual([adviceMock]);
      done();
    });
  });

  it('should get images', (done) => {
    const http = TestBed.inject<any>(require('@angular/common/http').HttpClient);
    const adviceMock = { id: 4, description: 'img', customInterval: true, interval: 40, media: undefined, promotion: null, visibilityRules: [] };
    spyOn(http, 'get').and.returnValue({ subscribe: ({ next }: any) => next([adviceMock]) });
    service.getImages('roomX').subscribe((res) => {
      expect(res).toEqual([adviceMock]);
      done();
    });
  });
*/
