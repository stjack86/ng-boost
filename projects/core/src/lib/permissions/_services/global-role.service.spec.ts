import { TestBed } from '@angular/core/testing';

import { GlobalRoleService } from './global-permissions.service';

describe('PermissionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GlobalRoleService = TestBed.get(GlobalRoleService);
    expect(service).toBeTruthy();
  });
});