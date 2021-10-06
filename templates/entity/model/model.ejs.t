---
to: src/models/<%= h.inflection.classify(name) %>.ts
---

import {DataTypes, Model} from 'sequelize';
import sequelize from '../config/database';
import {AutoDate, Column, Entity, Nullable, PrimaryKey, Unique} from '../utilities/SequelizeDecorator';

@Entity('<%= h.inflection.underscore(h.inflection.pluralize(name)) %>', { sequelize })
class <%= h.inflection.classify(name) %> extends Model {

    @PrimaryKey()
    public id!: number;

    @Nullable
    @Column(DataTypes.BOOLEAN)
    public status?: boolean;

    @AutoDate()
    public readonly createdAt!: Date;

    @AutoDate()
    public readonly updatedAt!: Date;

    @Nullable
    @Column(DataTypes.DATE)
    public readonly deletedAt?: Date;

    public toJSON(): Record<string, any> {
        const <%= h.inflection.camelize(h.inflection.underscore(name), true) %> = this.get('', { plain: true }) as Record<string, any>;
        if(!<%= h.inflection.camelize(h.inflection.underscore(name), true) %>.deletedAt){
            delete <%= h.inflection.camelize(h.inflection.underscore(name), true) %>.deletedAt;
        }
        return <%= h.inflection.camelize(h.inflection.underscore(name), true) %>;
    }
}


export default <%= h.inflection.classify(name) %>;
