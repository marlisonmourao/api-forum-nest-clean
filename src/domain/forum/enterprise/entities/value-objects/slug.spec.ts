import { Slug } from './slug'

test('it should create a slug from a string', () => {
  const slug = Slug.createFromText('An example title')

  expect(slug.value).toBe('an-example-title')
})
