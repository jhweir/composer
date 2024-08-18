"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BlockPreview from "./components/BlockPreview/BlockPreview";
import styles from "./page.module.scss";

export default function Home() {
  const [templates, setTemplates] = useState<any[]>([]);

  useEffect(() => {
    const localTemplates = localStorage.getItem("templates");
    console.log("localTemplates: ", localTemplates);
    if (localTemplates) setTemplates(JSON.parse(localTemplates));
  }, []);

  return (
    <div className={styles.wrapper}>
      {/* <h1>Welcome to WE</h1> */}
      <Link href="/template-builder/new">New Template</Link>
      <div className={styles.templates}>
        {templates.map((template) => (
          <div className={styles.template} key={template.id}>
            <Link href={`/template-builder/${template.id}`}>
              ID: {template.id}
            </Link>
            <BlockPreview data={template} depth={0} />
          </div>
        ))}
      </div>
    </div>
  );
}
