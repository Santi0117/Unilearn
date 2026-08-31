import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  COURSES, ACTIVITIES, SUBMISSIONS, FORUM_POSTS, ANNOUNCEMENTS,
  generateNotifications, VIDEO_PROGRESS, MATERIAL_VIEWS, BADGES, DIRECT_MESSAGES, PERIODS,
} from '../data/seedData';

const AppContext = createContext(null);

const LS = (key, fallback) => {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
};
const save = (key, val) => localStorage.setItem(key, JSON.stringify(val));

export function AppProvider({ children, userId, userRole }) {
  const [courses] = useState(COURSES);
  const [activities, setActivities] = useState(() => LS('uni_activities', ACTIVITIES));
  const [submissions, setSubmissions] = useState(() => LS('uni_submissions', SUBMISSIONS));
  const [forumPosts, setForumPosts] = useState(() => LS('uni_forums', FORUM_POSTS));
  const [announcements, setAnnouncements] = useState(() => LS('uni_announcements', ANNOUNCEMENTS));
  const [notifications, setNotifications] = useState(() =>
    LS(`uni_notifs_${userId}`, userId ? generateNotifications(userId, userRole) : [])
  );
  const [videoProgress, setVideoProgress] = useState(() => LS('uni_video', VIDEO_PROGRESS));
  const [materialViews, setMaterialViews] = useState(() => LS('uni_matviews', MATERIAL_VIEWS));
  const [badges] = useState(BADGES);
  const [messages, setMessages] = useState(() => LS('uni_messages', DIRECT_MESSAGES));
  const [darkMode, setDarkMode] = useState(() => LS('uni_dark', false));
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const syncSidebar = () => {
      if (mq.matches) {
        setSidebarVisible(true);
      } else {
        setSidebarVisible(false);
        setSidebarOpen(true);
      }
    };
    syncSidebar();
    mq.addEventListener('change', syncSidebar);
    return () => mq.removeEventListener('change', syncSidebar);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    if (!mq.matches && sidebarVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sidebarVisible]);

  useEffect(() => { save('uni_activities', activities); }, [activities]);
  useEffect(() => { save('uni_submissions', submissions); }, [submissions]);
  useEffect(() => { save('uni_forums', forumPosts); }, [forumPosts]);
  useEffect(() => { save('uni_announcements', announcements); }, [announcements]);
  useEffect(() => { if (userId) save(`uni_notifs_${userId}`, notifications); }, [notifications, userId]);
  useEffect(() => { save('uni_video', videoProgress); }, [videoProgress]);
  useEffect(() => { save('uni_matviews', materialViews); }, [materialViews]);
  useEffect(() => { save('uni_messages', messages); }, [messages]);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // ─── helpers ────────────────────────────────────────────────────────────────
  const getCourse = (id) => courses.find(c => c.id === id);

  const getMyCourses = useCallback((uid, role) => {
    if (role === 'student') return courses.filter(c => c.studentIds.includes(uid));
    if (role === 'professor') return courses.filter(c => c.professorId === uid);
    return courses;
  }, [courses]);

  const getCourseActivities = (courseId) =>
    activities.filter(a => a.courseId === courseId && a.visible !== false).sort((a, b) => a.week - b.week || a.order - b.order);

  const getWeekActivities = (courseId, week) =>
    getCourseActivities(courseId).filter(a => a.week === week);

  const getSubmission = (activityId, studentId) =>
    submissions.find(s => s.activityId === activityId && s.studentId === studentId);

  const getActivitySubmissions = (activityId) =>
    submissions.filter(s => s.activityId === activityId);

  const submitTask = (activityId, courseId, studentId, data) => {
    const existing = submissions.findIndex(s => s.activityId === activityId && s.studentId === studentId);
    const sub = {
      id: `sub-${Date.now()}`,
      activityId, courseId, studentId,
      submittedAt: new Date().toISOString(),
      ...data,
      grade: null, gradedAt: null, feedback: null, rubricGrades: null,
    };
    if (existing >= 0) {
      setSubmissions(prev => { const n = [...prev]; n[existing] = { ...n[existing], ...sub }; return n; });
    } else {
      setSubmissions(prev => [...prev, sub]);
    }
    addNotification({
      userId: courseId === 'course-1' ? 'prof-1' : courseId === 'course-2' ? 'prof-2' : 'prof-3',
      type: 'submission',
      title: 'Nueva entrega recibida',
      message: `Un estudiante entregó una actividad.`,
      link: `/courses/${courseId}/grades`,
    });
  };

  const submitQuiz = (activityId, courseId, studentId, answers, activity) => {
    let score = 0;
    activity.questions.forEach(q => {
      if (q.type === 'multiple' && answers[q.id] === q.correct) score += q.points;
      if (q.type === 'truefalse' && answers[q.id] === q.correct) score += q.points;
    });
    const sub = {
      id: `sub-q-${Date.now()}`,
      activityId, courseId, studentId,
      submittedAt: new Date().toISOString(),
      answers, grade: score, gradedAt: new Date().toISOString(),
    };
    setSubmissions(prev => [...prev, sub]);
    return score;
  };

  const gradeSubmission = (submissionId, grade, feedback, rubricGrades) => {
    setSubmissions(prev => prev.map(s =>
      s.id === submissionId
        ? { ...s, grade, feedback, rubricGrades, gradedAt: new Date().toISOString() }
        : s
    ));
  };

  const addActivity = (activity) => {
    setActivities(prev => [...prev, { ...activity, id: `act-${Date.now()}`, createdAt: new Date().toISOString() }]);
  };

  const updateActivity = (id, data) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
  };

  const deleteActivity = (id) => {
    setActivities(prev => prev.filter(a => a.id !== id));
  };

  const postForumReply = (activityId, studentId, studentName, content, parentId = null) => {
    if (parentId) {
      setForumPosts(prev => prev.map(fp =>
        fp.id === parentId
          ? { ...fp, replies: [...(fp.replies || []), { id: `fp-r-${Date.now()}`, studentId, studentName, content, postedAt: new Date().toISOString() }] }
          : fp
      ));
    } else {
      setForumPosts(prev => [...prev, {
        id: `fp-${Date.now()}`, activityId, studentId, studentName, content,
        postedAt: new Date().toISOString(), replies: [],
      }]);
    }
  };

  const postAnnouncement = (courseId, professorId, title, content) => {
    const ann = { id: `ann-${Date.now()}`, courseId, professorId, title, content, postedAt: new Date().toISOString(), isRead: false };
    setAnnouncements(prev => [ann, ...prev]);
  };

  const addNotification = (notif) => {
    setNotifications(prev => [{
      id: `n-${Date.now()}`,
      isRead: false,
      createdAt: new Date().toISOString(),
      ...notif,
    }, ...prev]);
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const updateVideoProgress = (userId, activityId, watched) => {
    setVideoProgress(prev => {
      const idx = prev.findIndex(v => v.userId === userId && v.activityId === activityId);
      if (idx >= 0) { const n = [...prev]; n[idx] = { ...n[idx], watched }; return n; }
      return prev;
    });
  };

  const markMaterialViewed = (userId, activityId) => {
    if (!materialViews.find(v => v.userId === userId && v.activityId === activityId)) {
      setMaterialViews(prev => [...prev, { userId, activityId }]);
    }
  };

  const sendMessage = (from, to, courseId, text) => {
    const threadId = [from, to].sort().join('-');
    setMessages(prev => {
      const idx = prev.findIndex(m => m.id === threadId);
      const msg = { id: `msg-${Date.now()}`, senderId: from, text, sentAt: new Date().toISOString() };
      if (idx >= 0) { const n = [...prev]; n[idx] = { ...n[idx], messages: [...n[idx].messages, msg] }; return n; }
      return [...prev, { id: threadId, from, to, courseId, messages: [msg] }];
    });
  };

  const getStudentGrades = (courseId, studentId) => {
    const course = getCourse(courseId);
    if (!course) return { items: [], total: 0, weighted: 0 };
    const acts = activities.filter(a => a.courseId === courseId && a.points);
    const items = acts.map(act => {
      const sub = getSubmission(act.id, studentId);
      return {
        activityId: act.id,
        title: act.title,
        category: act.category || 'General',
        points: act.points,
        grade: sub?.grade ?? null,
        weight: (course.gradeCategories.find(c => c.name === act.category)?.weight || 0),
        submittedAt: sub?.submittedAt || null,
        feedback: sub?.feedback || null,
      };
    });
    const byCategory = {};
    items.forEach(item => {
      if (item.grade !== null) {
        if (!byCategory[item.category]) byCategory[item.category] = { sum: 0, count: 0, weight: item.weight };
        byCategory[item.category].sum += item.grade;
        byCategory[item.category].count++;
      }
    });
    let weighted = 0;
    Object.values(byCategory).forEach(({ sum, count, weight }) => {
      weighted += (sum / count) * (weight / 100);
    });
    return { items, weighted: Math.round(weighted * 10) / 10 };
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <AppContext.Provider value={{
      courses, activities, submissions, forumPosts, announcements, notifications,
      videoProgress, materialViews, badges, messages, darkMode, sidebarOpen, sidebarVisible,
      setDarkMode, setSidebarOpen, setSidebarVisible,
      getCourse, getMyCourses, getCourseActivities, getWeekActivities,
      getSubmission, getActivitySubmissions, getStudentGrades,
      submitTask, submitQuiz, gradeSubmission,
      addActivity, updateActivity, deleteActivity,
      postForumReply, postAnnouncement, addNotification,
      markNotificationRead, markAllRead, unreadCount,
      updateVideoProgress, markMaterialViewed, sendMessage,
      periods: PERIODS,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
