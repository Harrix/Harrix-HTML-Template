import { library, dom } from '@fortawesome/fontawesome-svg-core'

//import faCustomIcons from './_fontawesome-harrix-icons.js'

import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faFileArchive } from '@fortawesome/free-solid-svg-icons/faFileArchive';
import { faDownload } from '@fortawesome/free-solid-svg-icons/faDownload';
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub';

library.add(
	faSearch,
    faFileArchive,
    faDownload,
    faGithub
);

dom.watch()