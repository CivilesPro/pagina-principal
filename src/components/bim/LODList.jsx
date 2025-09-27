import CollapseItem from '../ui/CollapseItem';
import ImageCarousel from '../ui/ImageCarousel';
import { lodItems } from '../../data/BimDeepSections';

const WHATS_NUMBER = '573127437848';
const mkWhatsapp = (msg) => `https://wa.me/${WHATS_NUMBER}?text=${encodeURIComponent(msg)}`;

export default function LODList() {
  return (
    <div className="space-y-4">
      {lodItems.map((item) => (
        <CollapseItem
          key={item.id}
          title={
            <span>
              <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">🧠</span>
              {item.title}
            </span>
          }
          subtitle={item.short}
          defaultOpen={false}
          level="main"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            <div className="lg:col-span-7">
              <p className="text-slate-600 text-sm md:text-base leading-6">{item.desc}</p>
              <a
                href={mkWhatsapp(item.whatsMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-xs text-slate-500 underline underline-offset-4 hover:text-slate-700"
              >
                ¿Este nivel encaja con tu proyecto? Escríbenos por WhatsApp
              </a>
            </div>
            <div className="lg:col-span-5">
              <ImageCarousel images={item.images} />
            </div>
          </div>
        </CollapseItem>
      ))}
    </div>
  );
}
