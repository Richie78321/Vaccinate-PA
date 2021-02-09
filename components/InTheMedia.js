import Image from 'next/image'

export default function InTheMedia() {

  return (
    <>
    <div class="container my-5">
      <div class="row align-items-center my-5 px-4">
        <div class="col gx-5">
          <a
            href="https://www.wsj.com/articles/covid-19-vaccine-confusion-leads-volunteers-to-create-online-guides-11612002601"
            target="_blank"
          >
            <div class="d-flex flex-column align-items-center">
              <p class="px-5 text-dark font-italic text-center">
                Covid-19 Vaccine Confusion Leads Volunteers to Create Online Guides
              </p>
              <Image
                alt="Wall Street Journal"
                className="d-inline align-middle"
                src="/images/WSJ.jpg"
                height={150}
                width={232}
              />
            </div>
          </a>
        </div>
        <div class="col gx-5">
          <a
            href="https://www.wtae.com/article/pitt-students-volunteer-to-create-website-to-help-pennsylvanians-find-covid-19-vaccines/35426401"
            target="_blank"
          >
            <div class="d-flex flex-column align-items-center">
              <p class="px-5 text-dark font-italic text-center">
                Pitt students volunteer to create website to help Pennsylvanians find COVID-19 vaccines
              </p>
              <Image
                alt="Pittsburgh's Action News 4"
                className="d-inline align-middle"
                src="/images/ActionNews.jpg"
                height={150}
                width={232}
              />
            </div>
          </a>
        </div>
      </div>
      <div class="row align-items-center my-5">
        <div class="col gx-5">
          <a
            href="https://www.post-gazette.com/local/region/2021/02/07/Stressed-Pennsylvanians-COVID-19-vaccination/stories/202102070138"
            target="_blank"
          >
            <div class="d-flex flex-column align-items-center">
              <p class="px-5 text-dark font-italic text-center">
                ‘It’s ridiculous’: Stressed Pennsylvanians craving easier path to COVID-19 vaccination
              </p>
              <Image
                alt="Pittsburgh Post Gazette"
                className="d-inline align-middle"
                src="/images/PittsburghPostGazette.jpg"
                height={150}
                width={232}
              />
            </div>
          </a>
        </div>
        <div class="col gx-5">
          <a
            href="https://cs.pitt.edu/news/2021-cs-students-create-vaccinatepa-org/"
            target="_blank"
          >
            <div class="d-flex flex-column align-items-center">
              <p class="px-5 text-dark font-italic text-center">
                CS Students Create VaccinatePA.org
              </p>
              <Image
                alt="University of Pittsburgh"
                className="d-inline align-middle"
                src="/images/PittSci.jpg"
                height={150}
                width={232}
              />
            </div>
          </a>
        </div>
        <div class="col gx-5">
          <a
            href="https://www.pittsburghmagazine.com/college-students-may-have-a-better-way-to-find-the-covid-vaccine/"
            target="_blank"
          >
            <div class="d-flex flex-column align-items-center">
              <p class="px-5 text-dark font-italic text-center">
              College Students May Have a Better Way to Find the COVID Vaccine
              </p>
              <Image
                alt="Pittsburgh Magazine"
                className="d-inline align-middle"
                src="/images/PittsburghMagazine.jpg"
                height={150}
                width={232}
              />
            </div>
          </a>
        </div>
      </div>
    </div>
    </>
  );
}
