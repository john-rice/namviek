import { Project } from '@prisma/client'
import { ObjectId } from 'bson'
import { projectModel } from './_prisma'

export const mdProjectAdd = async (data: Omit<Project, 'id'>) => {
  const id = new ObjectId().toString()
  return projectModel.create({
    data: { ...data, ...{ id } }
  })
}

export const mdProjectUpdate = async (data: Partial<Project>) => {
  const { id, ...rest } = data
  return projectModel.update({
    where: {
      id
    },
    data: rest
  })
}

export const mdProjectGetAllByIds = async (ids: string[]) => {
  return projectModel.findMany({
    where: {
      id: { in: ids }
    }
  })
}

export const mdProjectGet = async (id: string) => {
  return projectModel.findFirst({
    where: {
      id
    }
  })
}
