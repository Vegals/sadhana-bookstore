import type { CollectionConfig } from 'payload'
import type { User } from '../../payload-types'

const isAdminOrSelf = ({
  req,
  id,
}: {
  req: {
    user: User | null
  }
  id?: string | number
}) => {
  const { user } = req
  if (!user) return false
  if (user.role === 'admin') return true
  return user.id?.toString() === id?.toString()
}

const isAdmin = ({
  req,
}: {
  req: {
    user: User | null
  }
}) => {
  const { user } = req
  if (!user) return false
  return user.role === 'admin'
}

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 7200, // 2 hours
    verify: false,
    maxLoginAttempts: 5,
    lockTime: 600000, // 10 minutes
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role'],
    group: 'Admin',
  },
  access: {
    read: isAdminOrSelf,
    create: () => true, // Allow registration
    update: isAdminOrSelf,
    delete: isAdmin,
    admin: isAdmin,
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      defaultValue: 'user',
      required: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
      ],
      access: {
        update: isAdmin,
      },
    },
    {
      name: 'name',
      type: 'text',
      label: 'Name',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'readingPreferences',
      type: 'array',
      label: 'Reading Preferences',
      labels: {
        singular: 'Category',
        plural: 'Categories',
      },
      fields: [
        {
          name: 'category',
          type: 'relationship',
          relationTo: 'categories',
          required: true,
        },
      ],
    },
  ],
  timestamps: true,
}
