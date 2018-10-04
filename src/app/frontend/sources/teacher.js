import User from './user';
import axios from 'axios';

export default class Teacher extends User {
  static resource_path = '/users'; static path = '/users';

  static switchToTeacher(id) {
    return axios.patch(`${this.resource_path}/${id}/switch_role`);
  }

  static generateToken(id, params) {
    return axios.post(`${this.resource_path}/${id}/generate_token`, params);
  }
}

window.Teacher = Teacher;