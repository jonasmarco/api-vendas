import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Exclude, Expose } from 'class-transformer'

@Entity('users') // nome da tabela
class User {
  @PrimaryGeneratedColumn('uuid') // chave primária do tipo uuid
  id: string

  @Column() // coluna padrão
  name: string

  @Column()
  email: string

  @Column()
  @Exclude()
  password: string

  @Column()
  avatar: string

  @CreateDateColumn() // coluna do tipo data de criação
  created_at: Date

  @UpdateDateColumn() // coluna do tipo data de atualização
  updated_at: Date

  @Expose({ name: 'avatar_url' })
  getAvatarUrl(): string | null {
    if (!this.avatar) {
      return null
    }

    return `${process.env.APP_API_URL}/files/${this.avatar}`
  }
}

export default User
