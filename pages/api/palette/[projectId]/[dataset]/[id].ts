import createClient from '@sanity/client'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { projectId, dataset, id } = req.query

  try {
    const client = createClient({
      projectId: Array.isArray(projectId) ? projectId[0] : projectId,
      dataset: Array.isArray(dataset) ? dataset[0] : dataset,
      apiVersion: '2022-07-10',
      useCdn: true,
    })
    const palette = await client.fetch(
      /* groq */ `*[ _type == "sanity.imageAsset" && _id == $id ][0].metadata.palette`,
      { id: Array.isArray(id) ? id[0] : id }
    )
    return res.status(200).json(palette)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}
