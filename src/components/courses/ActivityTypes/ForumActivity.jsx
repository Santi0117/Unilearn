import { useState } from 'react';
import { MessageSquare, Send, ChevronDown, ChevronUp, Reply } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import Avatar from '../../ui/Avatar';
import { timeAgo } from '../../../utils/dateUtils';
import { USERS } from '../../../data/seedData';

export default function ForumActivity({ activity }) {
  const { user } = useAuth();
  const { forumPosts, postForumReply } = useApp();
  const [expanded, setExpanded] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [posting, setPosting] = useState(false);

  const posts = forumPosts.filter(fp => fp.activityId === activity.id);

  const handlePost = async () => {
    if (!newPost.trim()) return;
    setPosting(true);
    await new Promise(r => setTimeout(r, 300));
    postForumReply(activity.id, user.id, user.name, newPost);
    setNewPost('');
    setPosting(false);
  };

  const handleReply = async (postId) => {
    if (!replyText.trim()) return;
    postForumReply(activity.id, user.id, user.name, replyText, postId);
    setReplyText('');
    setReplyTo(null);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-start gap-3 p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="w-9 h-9 rounded-lg bg-cyan-100 flex items-center justify-center flex-shrink-0">
          <MessageSquare size={18} className="text-cyan-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <span className="text-xs font-semibold text-cyan-600 uppercase tracking-wide">Foro</span>
              <h4 className="font-semibold text-gray-900 text-sm mt-0.5">{activity.title}</h4>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">{posts.length} participaciones</span>
              {activity.isGraded && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">{activity.points} pts</span>}
              {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-1">{activity.description?.slice(0, 80)}</p>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 p-4 fade-in space-y-4">
          <p className="text-sm text-gray-600">{activity.description}</p>

          {/* Posts */}
          <div className="space-y-4">
            {posts.map(post => {
              const poster = USERS.find(u => u.id === post.studentId);
              return (
                <div key={post.id} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-start gap-3 mb-2">
                    <Avatar name={poster?.name || post.studentName} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-800">{poster?.name || post.studentName}</span>
                        {poster?.role === 'professor' && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">Docente</span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">{timeAgo(post.postedAt)}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 leading-relaxed ml-11"
                    dangerouslySetInnerHTML={{ __html: post.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />

                  {/* Replies */}
                  {post.replies?.map(reply => {
                    const replier = USERS.find(u => u.id === reply.studentId);
                    return (
                      <div key={reply.id} className="ml-11 mt-3 pl-3 border-l-2 border-gray-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Avatar name={replier?.name || reply.studentName} size="xs" />
                          <span className="text-xs font-semibold text-gray-700">{replier?.name || reply.studentName}</span>
                          {replier?.role === 'professor' && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-1 py-0.5 rounded font-medium">Docente</span>
                          )}
                          <span className="text-xs text-gray-400">{timeAgo(reply.postedAt)}</span>
                        </div>
                        <p className="text-xs text-gray-600">{reply.content}</p>
                      </div>
                    );
                  })}

                  <button onClick={() => setReplyTo(replyTo === post.id ? null : post.id)}
                    className="ml-11 mt-2 flex items-center gap-1 text-xs text-gray-400 hover:text-blue-600 transition-colors">
                    <Reply size={12} /> Responder
                  </button>

                  {replyTo === post.id && (
                    <div className="ml-11 mt-2 flex gap-2 fade-in">
                      <input value={replyText} onChange={e => setReplyText(e.target.value)}
                        placeholder="Tu respuesta..."
                        className="flex-1 px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyDown={e => e.key === 'Enter' && handleReply(post.id)}
                      />
                      <button onClick={() => handleReply(post.id)}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700">
                        <Send size={11} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {posts.length === 0 && (
              <div className="text-center py-6 text-gray-400 text-sm">
                Sé el primero en participar en este foro
              </div>
            )}
          </div>

          {/* New post */}
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <Avatar name={user.name} size="sm" />
            <div className="flex-1">
              <textarea value={newPost} onChange={e => setNewPost(e.target.value)}
                rows={3} placeholder="Comparte tu respuesta o reflexión..."
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <div className="flex justify-end mt-2">
                <button onClick={handlePost} disabled={!newPost.trim() || posting}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50">
                  <Send size={13} />
                  {posting ? 'Publicando...' : 'Publicar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
