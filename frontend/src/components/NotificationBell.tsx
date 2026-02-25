import { useState, useEffect } from "react";
import { Bell, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAura } from "../context/AuraContext";
import { Link } from "react-router-dom";

export default function NotificationBell() {
    const { user, getNotifications, markNotificationAsRead } = useAura();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (user) {
            loadNotifications();
            const interval = setInterval(loadNotifications, 60000); // Check every minute
            return () => clearInterval(interval);
        }
    }, [user]);

    const loadNotifications = async () => {
        try {
            const data = await getNotifications();
            setNotifications(data);
            setUnreadCount(data.filter((n: any) => !n.read).length);
        } catch (error) {
            console.error("Error loading notifications:", error);
        }
    };

    const handleRead = async (id: string) => {
        try {
            await markNotificationAsRead(id);
            setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-all"
                aria-label="Notificaciones"
                title="Notificaciones"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                        >
                            <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                                <span className="font-bold">Notificaciones</span>
                                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-black">
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="max-h-96 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="py-12 text-center text-gray-400">
                                        <p className="text-sm">No tienes notificaciones aún.</p>
                                    </div>
                                ) : (
                                    notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            className={`p-4 border-b border-gray-50 transition-colors ${notif.read ? 'opacity-60' : 'bg-blue-50/30'}`}
                                        >
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-start justify-between gap-2">
                                                    <span className="font-medium text-sm">{notif.title}</span>
                                                    {!notif.read && (
                                                        <button
                                                            onClick={() => handleRead(notif.id)}
                                                            className="text-blue-500 hover:text-blue-700"
                                                            title="Marcar como leída"
                                                        >
                                                            <Check size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500 leading-relaxed">{notif.message}</p>
                                                {notif.link && (
                                                    <Link
                                                        to={notif.link}
                                                        onClick={() => {
                                                            handleRead(notif.id);
                                                            setIsOpen(false);
                                                        }}
                                                        className="text-[11px] font-bold text-black uppercase tracking-wider mt-1 hover:underline"
                                                    >
                                                        Ver Recurso →
                                                    </Link>
                                                )}
                                                <span className="text-[10px] text-gray-400 mt-1">
                                                    {new Date(Number(notif.createdAt)).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
