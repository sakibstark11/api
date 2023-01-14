import {
    Entity,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export default class Common extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({ type: 'timestamptz', select: false })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz', select: false })
    updatedAt: Date;
}
