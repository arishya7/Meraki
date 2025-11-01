import React from 'react';

export const ChatBubbleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

export const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export const BotIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" {...props}>
        {/* Main chickpea body with hair */}
        <path fill="#FFCBA4" d="M165.23,116.52c-2.43,10.9-11.85,19.22-23.23,20.26c-15.66,1.4-30-8.16-36.46-22.18 c-5.91-12.86-2.18-28.32,9-37.45c12.4-10,29.9-8.5,40.48,3.75C167.38,100,168.2,112.4,165.23,116.52z M125.13,57c-1.15-4.14-2.4-8.16-4.15-12c-0.37-0.96-1.58-1.55-2.55-1.15c-0.96,0.37-1.55,1.58-1.15,2.55 c1.6,3.8,2.78,7.5,3.9,11.35c-1.96,0.37-4.1,0.2-6.09-0.3c-0.96-0.28-1.9,0.37-2.2,1.38c-0.28,0.96,0.37,1.9,1.38,2.2 c2.55,0.8,5.4,0.95,7.9,0.6C123.63,59.6,125,58.3,125.13,57z"/>
        {/* Face */}
        <circle fill="#4B4B4B" cx="121.7" cy="91.5" r="5"/>
        <circle fill="#4B4B4B" cx="140.7" cy="91.5" r="5"/>
        <path fill="none" stroke="#4B4B4B" strokeWidth="3" strokeLinecap="round" d="M125,102.5a8 8 0 0 0 13 0"/>
        {/* Shield */}
        <g transform="translate(-10, 5)">
            <path fill="#FFCBA4" stroke="#4B4B4B" strokeWidth="6" strokeLinejoin="round" d="M73.5,74.5c0,0-2.3-9.7,14.3-16.2c0,0-8.7,2.7-11.9,17.8c0,0-14.3-1.9-15.4,0 c-2.6,4.5,0.7,25.2,13.4,36.2c12.6-12.6,12.6-30.2,12.6-30.2s-24.5,6-33-3.8z"/>
            <path fill="none" stroke="#4B4B4B" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" d="M64 100 l8 8 l16 -16"/>
        </g>
        {/* Speech Bubble */}
        <g transform="translate(10, -15)">
            <path fill="#FFCBA4" stroke="#4B4B4B" strokeWidth="6" strokeLinejoin="round" d="M95.1,38.6c-11,0-19,6.3-19,15.8s8,15.8,19,15.8c1.5,0,4.7-0.8,6.3-2.4l7.9,2.4l-3.2-9.5 C107.8,54.6,110,38.6,95.1,38.6z"/>
            {/* Plane */}
            <g fill="#4B4B4B" transform="matrix(1.5, 0, 0, 1.5, 80, 47)">
                <path d="M4.3,2.4L-2.4,6.4C-3,6.7-3.6,6-3.1,5.5l3.8-3.1L-3.1-0.9 c-0.5-0.5,0.1-1.2,0.7-0.9L4.3,2c0.4,0.2,0.4,0.7,0,0.9L4.3,2.4z M5.5,5.4l-2-5.4c-0.1-0.3,0.1-0.6,0.4-0.5l5,2.1 c0.6,0.3,0.2,1.3-0.6,1.1l-2.4-0.6c-0.1,0-0.2,0.1-0.2,0.3l1.4,3.8c0.2,0.6-0.6,1-0.9,0.5L5.5,5.4z"/>
            </g>
        </g>
    </svg>
);

export const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
);

export const CalendarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h22.5" />
  </svg>
);

export const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.663v.003zM18 8.25a4.125 4.125 0 11-8.25 0 4.125 4.125 0 018.25 0z" />
  </svg>
);

export const MapPinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

export const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const MedicalIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

export const BaggageIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-1.5h5.25m-5.25 0h3m-3 0h-1.5m3 0h.75M9 12l3 3m0 0l3-3m-3 3v-6m-1.5-1.5H9a2.25 2.25 0 00-2.25 2.25v9.75c0 1.244 1.006 2.25 2.25 2.25h6c1.244 0 2.25-1.006 2.25-2.25V9A2.25 2.25 0 0015 6.75h-1.5" />
    </svg>
);

export const CancellationIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
    </svg>
);

export const DocumentTextIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
);

export const TripTypeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5l-3-3m0 0l3-3m-3 3h12.75" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5l3 3m0 0l-3 3m3-3H5.25" />
  </svg>
);

export const MSIGLogo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 324 74" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M72.34 68.17c-21.3 1.1-39.7-1.12-51.5-12.1-13.7-12.72-17.1-31.4-9.3-47.1 5-10.2 14.8-15.8 26.6-17.1 11.8-1.3 23.8.4 34.6 6.2 12 6.4 20.3 17.2 23.4 30.1 2.3 9.4.9 19.3-3.7 27.8-5.3 9.7-14.5 16.1-25.2 18.2-5 .9-10 .9-14.9.9z" fill="#D81E05" />
        <path d="M72.34 68.17c-17.3-1.8-32.2-7.8-43.1-20.1-9.9-11.2-13.4-26-10.4-39.9 2-9 6.8-16.7 13.5-22.9 8.2-7.5 18.5-11.5 29.5-12.3 11-.8 22 1.3 32 6.4 11.2 5.7 19.4 14.6 24 26.1 3.2 8 .8 16.7-3.5 24.2-4.8 8.4-12.4 14.6-22 18.2-7.2 2.7-15 3.7-22.8 3.7-3.4 0-6.8-.2-10.2-.4z" fill="#0F2A64" />
        <g fill="white" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="60">
            <text x="130" y="58">M</text>
            <text x="175" y="58">S</text>
            <text x="215" y="58">I</text>
            <text x="240" y="58">G</text>
        </g>
    </svg>
);

export const CreditCardIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
    </svg>
);

export const HashtagIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.875-13.5l-3.75 16.5m-1.875-16.5l-3.75 16.5" />
    </svg>
);

export const IdCardIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);

export const KeyboardIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5.25h6m-6 4.5h6m-6 4.5h6M5.25 5.25a2.25 2.25 0 012.25-2.25h9a2.25 2.25 0 012.25 2.25v13.5a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25V5.25z" />
    </svg>
);

export const FileUploadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
);
