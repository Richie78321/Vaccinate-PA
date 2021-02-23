import Image from "next/image";

export default function InTheMedia() {
  const media = [
    {
      href:
        "https://www.wsj.com/articles/covid-19-vaccine-confusion-leads-volunteers-to-create-online-guides-11612002601",
      title:
        "Covid-19 Vaccine Confusion Leads Volunteers to Create Online Guides",
      imagePath: "/images/WSJ.jpg",
      imageAlt: "Wall Street Journal",
    },
    {
      href:
        "https://www.wtae.com/article/pitt-students-volunteer-to-create-website-to-help-pennsylvanians-find-covid-19-vaccines/35426401",
      title:
        "Pitt students volunteer to create website to help Pennsylvanians find COVID-19 vaccines",
      imagePath: "/images/ActionNews.jpg",
      imageAlt: "Pittsburgh's Action News 4",
    },
    {
      href:
        "https://www.wearecentralpa.com/news/local-news/vaccinatepa-a-one-stop-search-engine-for-covid-19-vaccines/",
      title:
        "VaccinatePA: a one-stop search engine for COVID-19 vaccines",
      imagePath: "/images/WTAJ.jpg",
      immageAlt: "WTAJ CBS Altoona",
    },
    {
      href:
        "https://www.abc27.com/news/health/coronavirus/coronavirus-pennsylvania/i-need-to-get-involved-volunteer-run-vaccinatepa-org-helps-pennsylvanians-find-appointments/",
      title:
        "“I need to get involved” – Volunteer-run VaccinatePA.org helps Pennsylvanians find appointments",
      imagePath: "/images/ABC27.jpg",
      imageAlt: "ABC 27 Harrisburg",
    },
    {
      href:
        "https://www.pittsburghmagazine.com/college-students-may-have-a-better-way-to-find-the-covid-vaccine/",
      title: "College Students May Have a Better Way to Find the COVID Vaccine",
      imagePath: "/images/PittsburghMagazine.jpg",
      imageAlt: "Pittsburgh Magazine",
    },
    {
      href:
        "https://pittsburgh.cbslocal.com/2021/02/04/college-students-create-website-coronavirus-vaccine-website/",
      title:
        "COVID-19 In Pennsylvania: 3 College Students Create Website For Finding Vaccine",
      imagePath: "/images/KDKA.jpg",
      imageAlt: "KDKA CBS Pittsburgh",
    },
  ];

  return (
    <div className="container mt-5">
      <h3 className="text-center mb-3">In the Media</h3>
      <div className="row align-items-center mb-3 px-4">
        {media.map((media_instance) => (
          <div key={media_instance.href} className="col-12 col-sm-6 col-md-4">
            <a href={media_instance.href} target="_blank" rel="noreferrer">
              <div className="d-flex flex-column align-items-center">
                <Image
                  alt={media_instance.imageAlt}
                  className="d-inline align-middle"
                  src={media_instance.imagePath}
                  layout="fixed"
                  height={100}
                  width={155}
                />
                <p className="text-dark font-italic text-center">
                  {media_instance.title}
                </p>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
