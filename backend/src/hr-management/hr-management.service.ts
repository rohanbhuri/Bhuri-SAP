import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../entities/employee.entity';

@Injectable()
export class HrManagementService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  async getEmployees() {
    return this.employeeRepository.find();
  }

  async getStats() {
    const total = await this.employeeRepository.count();
    const active = await this.employeeRepository.count({ where: { status: 'active' } });
    return { total, active, departments: 5 };
  }

  async createEmployee(employeeData: any) {
    const employee = this.employeeRepository.create(employeeData);
    return this.employeeRepository.save(employee);
  }

  async updateEmployee(id: string, employeeData: any) {
    await this.employeeRepository.update(id, employeeData);
    return this.employeeRepository.findOne({ where: { _id: id as any } });
  }

  async deleteEmployee(id: string) {
    return this.employeeRepository.delete(id);
  }
}