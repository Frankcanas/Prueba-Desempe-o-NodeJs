import { Transaction } from 'sequelize';
import { User, UserInput } from '../models/user.model';

export class UserRepository {
  /**
   * Busca un usuario por su correo electrónico
   * @param email Correo electrónico del usuario
   */
  public async findByEmail(email: string, transaction?: Transaction): Promise<User | null> {
    return await User.findOne({ where: { email }, transaction });
  }

  /**
   * Busca un usuario por su ID
   * @param id Identificador único UUID
   */
  public async findById(id: string, transaction?: Transaction): Promise<User | null> {
    return await User.findByPk(id, { transaction });
  }

  /**
   * Crea un nuevo usuario en la base de datos
   * @param userData Datos del usuario
   */
  public async create(userData: UserInput, transaction?: Transaction): Promise<User> {
    return await User.create(userData, { transaction });
  }

  /**
   * Obtiene todos los usuarios registrados
   */
  public async findAll(transaction?: Transaction): Promise<User[]> {
    return await User.findAll({
      attributes: { exclude: ['password'] },
      transaction,
    });
  }

  /**
   * Inserción masiva de usuarios (utilizado por el Seeder)
   * @param users Lista de usuarios a crear
   */
  public async bulkCreate(users: UserInput[], transaction?: Transaction): Promise<User[]> {
    return await User.bulkCreate(users, { validate: true, transaction });
  }
}

export const userRepository = new UserRepository();

