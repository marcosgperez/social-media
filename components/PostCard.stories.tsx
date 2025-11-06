import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PostCard } from './PostCard';

const meta = {
  title: 'Components/PostCard',
  component: PostCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '600px', maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    likes: {
      control: { type: 'number', min: 0 },
      description: 'Number of likes',
    },
    comments: {
      control: { type: 'number', min: 0 },
      description: 'Number of comments',
    },
    isLiked: {
      control: 'boolean',
      description: 'Whether the current user has liked this post',
    },
    content: {
      control: 'text',
      description: 'Post content',
    },
  },
  args: {
    onLike: fn(),
    onComment: fn(),
  },
} satisfies Meta<typeof PostCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default post card with text only
 */
export const Default: Story = {
  args: {
    id: '1',
    author: {
      username: 'juanperez',
    },
    content: '¡Hola mundo! Este es mi primer post en la red social.',
    likes: 5,
    comments: 2,
    createdAt: new Date().toISOString(),
    isLiked: false,
  },
};

/**
 * Post card with an image
 */
export const WithImage: Story = {
  args: {
    id: '2',
    author: {
      username: 'mariagomez',
    },
    content: 'Compartiendo esta hermosa vista desde mi viaje 🌄',
    likes: 42,
    comments: 8,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    isLiked: false,
  },
};

/**
 * Post card that has been liked by the user
 */
export const Liked: Story = {
  args: {
    id: '3',
    author: {
      username: 'carlosrodriguez',
    },
    content: 'Acabo de terminar mi proyecto de React. ¡Estoy muy emocionado! 🚀',
    likes: 128,
    comments: 15,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    isLiked: true,
  },
};

/**
 * Post card with long content
 */
export const LongContent: Story = {
  args: {
    id: '4',
    author: {
      username: 'analopez',
    },
    content: `Hoy quiero compartir mi experiencia aprendiendo desarrollo web. Ha sido un viaje increíble lleno de desafíos y aprendizajes.

Empecé con HTML y CSS, luego pasé a JavaScript, y ahora estoy trabajando con React y Next.js. Cada día aprendo algo nuevo y me siento más confiada en mis habilidades.

Mi consejo para quienes están empezando: ¡no se rindan! La práctica constante es la clave del éxito. 💪

#WebDevelopment #React #NextJS #Learning`,
    likes: 89,
    comments: 23,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    isLiked: false,
  },
};

/**
 * Post card with image and many interactions
 */
export const Popular: Story = {
  args: {
    id: '5',
    author: {
      username: 'techguru',
    },
    content: '🔥 Nuevo tutorial sobre TypeScript disponible en mi canal. ¡No te lo pierdas!',
    likes: 1234,
    comments: 156,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
    isLiked: true,
  },
};

/**
 * Post card with no interactions yet
 */
export const NoInteractions: Story = {
  args: {
    id: '6',
    author: {
      username: 'newuser',
    },
    content: 'Mi primer post aquí. ¡Hola a todos! 👋',
    likes: 0,
    comments: 0,
    createdAt: new Date(Date.now() - 300000).toISOString(),
    isLiked: false,
  },
};

/**
 * Post card with author avatar
 */
export const WithAvatar: Story = {
  args: {
    id: '7',
    author: {
      username: 'developer',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
    content: 'Trabajando en un nuevo proyecto emocionante 💻',
    likes: 67,
    comments: 12,
    createdAt: new Date(Date.now() - 43200000).toISOString(),
    isLiked: false,
  },
};

/**
 * Post card with emoji-only content
 */
export const EmojiOnly: Story = {
  args: {
    id: '8',
    author: {
      username: 'emojimaster',
    },
    content: '🎉🎊🥳🎈🎁',
    likes: 234,
    comments: 45,
    createdAt: new Date(Date.now() - 600000).toISOString(),
    isLiked: true,
  },
};

/**
 * Post card with portrait image
 */
export const WithPortraitImage: Story = {
  args: {
    id: '9',
    author: {
      username: 'photographer',
      avatar: 'https://i.pravatar.cc/150?img=25',
    },
    content: 'Nueva sesión de fotos 📸',
    likes: 456,
    comments: 78,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600',
    isLiked: false,
  },
};
