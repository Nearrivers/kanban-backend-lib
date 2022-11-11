import { validate } from 'class-validator';
import { EntityManager } from 'typeorm';
import { MockConnection } from '../../utils/MockConnection';
import { Tag } from '../Tag';

describe('tag entity tests', () => {
  const mockConnection = new MockConnection();
  let manager: EntityManager;

  beforeAll(async () => {
    manager = await mockConnection.initializeMockDb();
  })

  test(`GIVEN I want to create a new tag
    WHEN I try to insert a tag with the correct fields
    THEN a new tag is created
    AND I am able to retrieve it`, async () => {
    const tag = new Tag();
    tag.name = 'tag';
    tag.color = 0x00000000;

    await manager.save(tag);

    const createdTag = await manager.findOne(Tag, {
      where: {
        name: 'tag'
      }
    });

    expect(createdTag).toBeDefined();
    expect(createdTag.name).toEqual('tag');
  })

  test(`GIVEN I want to create a new tag
     WHEN I try to insert a tag with an undefined name
     THEN no tag is created`, async () => {
    const tag = new Tag();
    tag.name = undefined;
    tag.color = 0x00000000;

    const errors = await validate(tag);

    if (!(errors.length > 0)) throw new Error();

    if (errors.length > 0) {
      expect(errors[0].constraints.isLength).toEqual('name must be longer than or equal to 1 characters');
    }
  })

  test(`GIVEN I want to create a new tag
     WHEN I try to insert a tag with an empty name
     THEN no tag is created`, async () => {
    const tag = new Tag();
    tag.name = '';
    tag.color = 0x00000000;

    const errors = await validate(tag);

    if (!(errors.length > 0)) throw new Error();

    if (errors.length > 0) {
      expect(errors[0].constraints.isLength).toEqual('name must be longer than or equal to 1 characters');
    }
  })

  test(`GIVEN I want to create a new tag
     WHEN I try to insert a tag with a name that is too long
     THEN no tag is created`, async () => {
    const tag = new Tag();
    tag.name = 'a'.repeat(51);
    tag.color = 0x00000000;

    const errors = await validate(tag);

    if (!(errors.length > 0)) throw new Error();

    if (errors.length > 0) {
      expect(errors[0].constraints.isLength).toEqual('name must be shorter than or equal to 50 characters');
    }
  })

  test(`GIVEN I want to create a new tag
     WHEN I try to insert a tag with a negative value color
     THEN no tag is created`, async () => {
    const tag = new Tag();
    tag.name = 'tag2';
    tag.color = -1;

    const errors = await validate(tag);

    if (!(errors.length > 0)) throw new Error();

    if (errors.length > 0) {
      expect(errors[0].constraints.min).toEqual('color must not be less than 0');
    }
  })

  test(`GIVEN I want to create a new tag
     WHEN I try to insert a tag with a color value over 0xFFFFFFFF
     THEN no tag is created`, async () => {
    const tag = new Tag();
    tag.name = 'tag2';
    tag.color = 0xFFFFFFFFF;

    const errors = await validate(tag);

    if (!(errors.length > 0)) throw new Error();

    if (errors.length > 0) {
      expect(errors[0].constraints.max).toEqual('color must not be greater than 4294967295');
    }
  })

  // afterAll(async () => {
  //   await mockConnection.tearDown();
  // })
})