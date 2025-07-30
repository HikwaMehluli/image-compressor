import { Heart, MessageSquareText } from 'lucide-react';

export default function Footer() {
  const feedbackFormUrl = process.env.NEXT_PUBLIC_FEEDBACK_FORM_URL;

  return (
    <footer className="container mx-auto py-4 px-4 md:px-8 flex items-center justify-between">
      {feedbackFormUrl && (
         <a
          href={feedbackFormUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-muted-foreground hover:text-foreground hover:underline flex items-center gap-2"
        >
          <MessageSquareText size={16} />
          Feedback
        </a>
      )}
      <a
        href="https://thatafro.netlify.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-semibold text-muted-foreground hover:text-foreground hover:underline flex items-center gap-2"
      >
        Created with <Heart size={16} fill="currentColor" className="w-4 h-4 text-red-500 inline-block" /> by thatAfro
      </a>
    </footer>
  );
}
