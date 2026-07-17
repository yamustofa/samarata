try {
	const savedTheme = localStorage.getItem("samarata-theme");
	const isDark =
		savedTheme === "dark" ||
		(!savedTheme && matchMedia("(prefers-color-scheme: dark)").matches);
	document.documentElement.classList.toggle("dark", isDark);
} catch {}
