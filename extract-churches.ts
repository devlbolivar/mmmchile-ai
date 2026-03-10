import { writeFileSync } from 'fs';
import { churchesSeed } from './src/lib/data/churches-seed';

const docs = churchesSeed.map(church => {
    const { _id, slug, image, ...rest } = church;
    return {
        type: 'church',
        content: {
            _id: _id, // keep the same _id
            ...rest,
            slug: { _type: 'slug', current: slug },
            image: image // putting the static path here
        }
    };
});

writeFileSync('churches-to-sanity.json', JSON.stringify(docs, null, 2));
console.log("Done");
