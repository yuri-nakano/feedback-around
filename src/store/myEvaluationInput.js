export const state = () => ({
  indicators: [],
  myEvaluationEvaluatorName: '',
  professionRanks: [],
  editedItem: '',
  me: [],
  ranks: '',
  indicatorSubcategoryRanks: [],
})

export const mutations = {
  setMe(state, me) {
    state.me = me
    console.log(me)
  },
  setMyEvaluationEvaluatorName(state, myEvaluationEvaluatorName) {
    state.myEvaluationEvaluatorName = myEvaluationEvaluatorName
  },
  setIndicators(state, indicators) {
    state.indicators = indicators
  },
  setProfessionRanks(state, professionRanks) {
    state.professionRanks = professionRanks
  },
  setEditedItem(state, editedItem) {
    state.editedItem = editedItem
    console.log('editedItem', editedItem)
  },
  setIndicatorSubcategoryRanks(state, indicatorSubcategoryRanks) {
    state.indicatorSubcategoryRanks = indicatorSubcategoryRanks
    console.log('indicatorSubcategoryRanks', indicatorSubcategoryRanks)
  },
}

export const actions = {
  async getMe({ dispatch, commit }) {
    await this.$axios
      .$get('/me')
      .then((response) => {
        // response = require('../testdata/me_sample.json')
        console.log(response)
        commit('setMe', response)
      })
      .catch(function (error) {
        console.log(error)
        dispatch('displayErrorSnackbar', 'ログインユーザ情報の取得に失敗しました')
      })
  },
  async getMyEvaluationDisplay({ dispatch, commit, rootState, state }) {
    await dispatch('getMe')
    const pre = await this.$axios.$get(`/presenters`)
    console.log('pre', pre)
    console.log(rootState.presentationTabs.presentation.id)
    const presenter = await this.$axios.$get(
      `/presenters?filter_user_id=${state.me.id}&filter_presentation_id=${rootState.presentationTabs.presentation.id}`
    )
    console.log('presenter', presenter)
    let editedItem = {}
    const indicatorSubcategoryRanks = []
    const professionId = presenter.items[0].user.rank.profession_id
    console.log('professionId', professionId)
    const professionRank = await this.$axios.$get(`/ranks?filter_profession_id=${professionId}`)
    console.log(professionRank.items)
    const professionRanks = []
    for (let i = 0; i < professionRank.items.length; i++) {
      const box = { code: professionRank.items[i].code, id: professionRank.items[i].id }
      professionRanks.push(box)
      console.log(professionRank.items[i].code)
    }
    commit('setProfessionRanks', professionRanks)
    const indicators = await this.$axios.$get(`/indicator_categories?filter_profession_id=${professionId}`)
    commit('setIndicators', indicators)
    console.log('indicators', indicators)
    console.log('indicators', indicators.items)
    // const subRank = await this.$axios.$get(`/indicator_subcategory_ranks`)
    const subRank = require('../testdata/indicator_subcategory_ranks.json')
    console.log('subRank', subRank)
    // const res = await require('../testdata/evaluation_and_feedback')
    await this.$axios
      .$get(`evaluation_and_feedback?presenter_id=${presenter.items[0].id}`)
      .then((response) => {
        const myEvaluationDisplay = response.items
        let myEvaluation = ''
        for (let i = 0; i < myEvaluationDisplay.length; i++) {
          if (myEvaluationDisplay[i].evaluator_id === myEvaluationDisplay[i].presenter_id) {
            myEvaluation = Object.assign({}, myEvaluationDisplay[i])
          }
        }
        const myEvaluationEvaluatorName = myEvaluation.evaluator.name
        commit('setMyEvaluationEvaluatorName', myEvaluationEvaluatorName)
        editedItem = {
          presenter_id: presenter.items[0].id,
          evaluator_id: presenter.items[0].user_id,
          comment: myEvaluation.comment,
          want_rank_id: myEvaluation.want_rank_id,
          indicatorCategoryEvaluations: [],
        }
        for (let i = 0; i < indicators.items.length; i++) {
          const indicatorSubcategoryEvaluations = {
            indicator_category_id: indicators.items[i].indicatorSubcategories[0].indicator_category_id,
            comment: myEvaluation.indicatorCategoryEvaluationAndFeedbacks[i].comment,
            indicatorSubcategoryEvaluations: [],
          }
          for (let j = 0; j < indicators.items[i].indicatorSubcategories.length; j++) {
            const sRank = []
            const sub = subRank.items.filter(
              (item) => item.indicator_subcategory_id === indicators.items[i].indicatorSubcategories[j].id
            )
            sRank.push(sub)
            indicatorSubcategoryRanks.push(subRank)
            console.log(sRank, sub)
            const item = {
              indicator_subcategory_id:
                indicators.items[i].indicatorSubcategories[j].indicatorSubcategoryRanks[0].indicator_subcategory_id,
              rank_id:
                myEvaluation.indicatorCategoryEvaluationAndFeedbacks[i].indicatorSubcategoryEvaluations[j]
                  .indicator_subcategory_rank_id,
            }
            indicatorSubcategoryEvaluations.indicatorSubcategoryEvaluations.push(item)
          }
          editedItem.indicatorCategoryEvaluations.push(indicatorSubcategoryEvaluations)
        }
        console.log('editedItem', editedItem)
        commit('setIndicatorSubcategoryRanks', indicatorSubcategoryRanks)
        commit('setEditedItem', editedItem)
      })
      .catch(function () {
        editedItem = {
          presenter_id: presenter.items[0].id,
          evaluator_id: presenter.items[0].user_id,
          comment: '',
          want_rank_id: '1',
          indicatorCategoryEvaluations: [],
        }
        for (let i = 0; i < indicators.items.length; i++) {
          const indicatorSubcategoryEvaluations = {
            indicator_category_id: indicators.items[i].id,
            comment: '',
            indicatorSubcategoryEvaluations: [],
          }
          for (let j = 0; j < indicators.items[i].indicatorSubcategories.length; j++) {
            const sub = subRank.items.filter(
              (item) => item.indicator_subcategory_id === indicators.items[i].indicatorSubcategories[j].id
            )
            indicatorSubcategoryRanks.push(sub)
            console.log(indicatorSubcategoryRanks)
            const item = {
              indicator_subcategory_id: indicators.items[i].indicatorSubcategories[j].id,
              rank_id: '1',
            }
            indicatorSubcategoryEvaluations.indicatorSubcategoryEvaluations.push(item)
          }
          editedItem.indicatorCategoryEvaluations.push(indicatorSubcategoryEvaluations)
        }
        console.log('editedItems', editedItem)
        commit('setEditedItem', editedItem)
        commit('setIndicatorSubcategoryRanks', indicatorSubcategoryRanks)
      })
  },
  async updateMyEvaluation({ dispatch }, item) {
    // 評価ランクが更新されていた場合は置き換える
    for (let i = 0; i < item.editedItems.indicatorCategoryEvaluations.length; i++) {
      for (
        let j = 0;
        j < item.editedItems.indicatorCategoryEvaluations[i].indicatorSubcategoryEvaluations.length;
        j++
      ) {
        const subcategoryId =
          item.editedItems.indicatorCategoryEvaluations[i].indicatorSubcategoryEvaluations[j].indicator_subcategory_id
        for (let k = 0; k < item.selectedRanks.length; k++) {
          const selectedSubcategoryId = item.selectedRanks[k].indicator_subcategory_id
          if (Number(subcategoryId) === Number(selectedSubcategoryId)) {
            item.editedItems.indicatorCategoryEvaluations[i].indicatorSubcategoryEvaluations[j] = item.selectedRanks[k]
          }
        }
      }
    }
    for (let i = 0; i < item.editedItems.indicatorCategoryEvaluations.length; i++) {
      const categoryId = item.editedItems.indicatorCategoryEvaluations[i].indicator_category_id
      for (let k = 0; k < item.selectedComment.length; k++) {
        const indicatorCategoryId = item.selectedComment[k].indicator_category_id
        if (Number(categoryId) === Number(indicatorCategoryId)) {
          item.editedItems.indicatorCategoryEvaluations[i].comment = item.selectedComment[k].comment
        }
      }
    }
    // サーバーへPUTする情報
    const body = {
      presenter_id: item.editedItems.presenter_id,
      evaluator_id: item.editedItems.evaluator_id,
      comment: item.editedItems.comment,
      want_rank_id: item.editedItems.want_rank_id,
      indicatorCategoryEvaluations: item.editedItems.indicatorCategoryEvaluations,
    }
    console.log(body)
    await this.$axios
      .$post(`/evaluations`, body)
      .then((response) => {
        dispatch('snackbar/displaySuccessSnackbar', 'ランクの更新に成功しました', { root: true })
      })
      .catch((error) => {
        console.log(error)
        dispatch('snackbar/displayErrorSnackbar', 'ランクの更新に失敗しました', { root: true })
      })
  },
}
