import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

import Customer from '@modules/customers/infra/typeorm/entities/Customer'
import OrdersProducts from './OrdersProducts'

@Entity('orders') // nome da tabela
class Order {
  @PrimaryGeneratedColumn('uuid') // chave primária do tipo uuid
  id: string

  @ManyToOne(() => Customer) // muitas orders para 1 customer
  @JoinColumn({ name: 'customer_id' })
  customer: Customer

  @OneToMany(() => OrdersProducts, order_products => order_products.order, {
    cascade: true
  })
  order_products: OrdersProducts[]

  @CreateDateColumn() // coluna do tipo data de criação
  created_at: Date

  @UpdateDateColumn() // coluna do tipo data de atualização
  updated_at: Date
}

export default Order
