import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

import Order from './Order'
import Product from '@modules/products/typeorm/entities/Product'

@Entity('orders_products') // nome da tabela
class OrdersProducts {
  @PrimaryGeneratedColumn('uuid') // chave primária do tipo uuid
  id: string

  @ManyToOne(() => Order, order => order.order_products)
  @JoinColumn({ name: 'order_id' })
  order: Order

  @ManyToOne(() => Product, product => product.order_products)
  @JoinColumn({ name: 'product_id' })
  product: Product

  @Column()
  order_id: string

  @Column()
  product_id: string

  @Column('decimal')
  price: number

  @Column('int')
  quantity: number

  @CreateDateColumn() // coluna do tipo data de criação
  created_at: Date

  @UpdateDateColumn() // coluna do tipo data de atualização
  updated_at: Date
}

export default OrdersProducts
