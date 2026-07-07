export const gradeColor = (grade) => {
  if (grade === null || grade === undefined) return 'text-gray-400';
  if (grade >= 90) return 'text-emerald-600';
  if (grade >= 80) return 'text-blue-600';
  if (grade >= 70) return 'text-amber-600';
  return 'text-red-500';
};

export const gradeLabel = (grade) => {
  if (grade === null || grade === undefined) return '—';
  if (grade >= 90) return 'A';
  if (grade >= 80) return 'B';
  if (grade >= 70) return 'C';
  if (grade >= 60) return 'D';
  return 'F';
};

export const gradeBg = (grade) => {
  if (grade === null || grade === undefined) return 'bg-gray-100 text-gray-500';
  if (grade >= 90) return 'bg-emerald-100 text-emerald-700';
  if (grade >= 80) return 'bg-blue-100 text-blue-700';
  if (grade >= 70) return 'bg-amber-100 text-amber-700';
  return 'bg-red-100 text-red-700';
};

export const passes = (grade, min = 70) => grade !== null && grade >= min;
