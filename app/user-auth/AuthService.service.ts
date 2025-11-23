import bcrypt from "bcrypt";
import { DatabaseService } from "~/shared-library/DatabaseService.service";

export class AuthService {
  private db: DatabaseService;

  constructor() {
    this.db = new DatabaseService();
  }

  async validateLogin(email: string, password: string) {
    const result = await this.db.query("users", "select", {
      where: { u_email: email },
      limit: 1,
    });

    if (!result || result.length === 0) return null;
    const user = result[0];
    const match = await bcrypt.compare(password, user.u_password_hash);
    if (!match) return null;

    return {
      id: user.u_id,
      username: user.u_username,
      email: user.u_email,
    };
  }


  async checkUserPermission(userId: number, appType: string, runType?: string) {
    const roleIds = await this.getUserRoleIds(userId);
    if (runType) {
      return await this.getRunTypePermission(roleIds, appType, runType);
    }
    return await this.getDefaultAppPermission(roleIds, appType);
  }

  private async getUserRoleIds(userId: number): Promise<number[]> {
    const rows = await this.db.query('users as u', 'select', {
      joins: [
        { table: 'user_role_map as urm', first: 'u.u_id', operator: '=', second: 'urm.urm_u_id' },
        { table: 'roles as r', first: 'urm.urm_r_id', operator: '=', second: 'r.r_id' }
      ],
      where: { 'u.u_id': userId, 'u.u_status': true, 'r.r_status': true },
      select: ['r.r_id'],
    });
    return rows.map(r => r.r_id);
  }

  private async getRunTypePermission(roleIds: number[], appType: string, runType: string) {
    const run_type = await this.db.query('app_run_types as ar', 'select', {
      joins: [
        { table: 'app_types as a', first: 'ar.ar_a_id', operator: '=', second: 'a.a_id' }
      ],
      where: { 'a.a_type': appType, 'ar.ar_type': runType },
      select: ['ar.ar_id', 'ar.ar_class', 'ar.ar_method', 'ar.ar_http_method'],
      limit: 1
    });

    if (!run_type.length) return null;

    const permission = await this.db.knex('role_permissions').where('rp_app_run_type_id', run_type[0].ar_id).whereIn('rp_r_id', roleIds).first();
    if (!permission) return null;

    return {
      class_Name: run_type[0].ar_class,
      class_Method_Name: run_type[0].ar_method
    };
  }

  private async getDefaultAppPermission(roleIds: number[], appType: string) {
    const app_type = await this.db.query('app_types', 'select', { where: { a_type: appType }, limit: 1 });
    if (!app_type.length) return null;

    const permission = await this.db.knex('role_permissions').where('rp_app_type_id', app_type[0].a_id).whereIn('rp_r_id', roleIds).first();
    if (!permission) return null;

    return {
      class_Name: app_type[0].a_default_class,
      class_Method_Name: app_type[0].a_default_method,
    };
  }
}
