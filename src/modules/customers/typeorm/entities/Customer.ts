import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity('customers') // nome da tabela
class Customer {
  @PrimaryGeneratedColumn('uuid') // chave primária do tipo uuid
  id: string

  @Column() // coluna padrão
  name: string

  @Column()
  email: string

  @CreateDateColumn() // coluna do tipo data de criação
  created_at: Date

  @UpdateDateColumn() // coluna do tipo data de atualização
  updated_at: Date
}

export default Customer
